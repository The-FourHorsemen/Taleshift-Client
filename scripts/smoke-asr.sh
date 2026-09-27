#!/usr/bin/env bash
# Smoke-test deployed ASR + Vercel /api/asr proxy.
#
# Usage:
#   ASR_URL=https://taleshift-server.fly.dev \
#   WEB_URL=https://taleshift-client.vercel.app \
#   ./scripts/smoke-asr.sh
#
# Optional:
#   SAMPLE_WAV=path/to/file.wav   (defaults to scripts/fixtures/sample.wav)
#   TIMEOUT_SECS=120              (Whisper cold starts can be slow)

set -u

ASR_URL="${ASR_URL:-}"
WEB_URL="${WEB_URL:-}"
SAMPLE_WAV="${SAMPLE_WAV:-$(cd "$(dirname "$0")" && pwd)/fixtures/sample.wav}"
TIMEOUT_SECS="${TIMEOUT_SECS:-120}"

STORY_ID="smoke-story"
SESSION_ID="smoke-session-$(date +%s)"
REFERENCE_TEXT="The ancient map led them deep into the heart of the jungle."

RED=$'\033[31m'
GRN=$'\033[32m'
YLW=$'\033[33m'
RST=$'\033[0m'

PASS=0
FAIL=0
FLAGS=()

pass() { PASS=$((PASS + 1)); printf '%s✓%s %s\n' "$GRN" "$RST" "$1"; }
fail() {
  FAIL=$((FAIL + 1))
  FLAGS+=("$1")
  printf '%s✗%s %s\n' "$RED" "$RST" "$1"
  if [[ -n "${2:-}" ]]; then
    printf '  %s\n' "$2" | head -c 2000
    echo
  fi
}
info() { printf '%s·%s %s\n' "$YLW" "$RST" "$1"; }

need_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1" >&2
    exit 2
  }
}

need_cmd curl
need_cmd python3

if [[ -z "$ASR_URL" || -z "$WEB_URL" ]]; then
  cat >&2 <<EOF
Set both URLs before running:

  export ASR_URL=https://your-asr.example
  export WEB_URL=https://your-app.vercel.app
  ./scripts/smoke-asr.sh
EOF
  exit 2
fi

# Strip trailing slashes
ASR_URL="${ASR_URL%/}"
WEB_URL="${WEB_URL%/}"

if [[ ! -f "$SAMPLE_WAV" ]]; then
  fail "Sample WAV missing at $SAMPLE_WAV"
  exit 1
fi

tmpdir=$(mktemp -d)
trap 'rm -rf "$tmpdir"' EXIT

echo "=== Taleshift ASR smoke test ==="
info "ASR_URL=$ASR_URL"
info "WEB_URL=$WEB_URL"
info "SAMPLE_WAV=$SAMPLE_WAV ($(wc -c < "$SAMPLE_WAV") bytes)"
info "sessionId=$SESSION_ID"
echo

# --- 1) Health ---------------------------------------------------------------
echo "1) GET $ASR_URL/health"
health_body="$tmpdir/health.json"
health_code=$(curl -sS -o "$health_body" -w "%{http_code}" \
  --max-time 30 \
  "$ASR_URL/health" || echo "000")

if [[ "$health_code" == "200" ]] && python3 - "$health_body" <<'PY'
import json, sys
data = json.load(open(sys.argv[1]))
sys.exit(0 if data.get("status") == "ok" else 1)
PY
then
  pass "ASR /health → 200 {status: ok}"
else
  fail "ASR /health failed (HTTP $health_code)" "$(cat "$health_body" 2>/dev/null)"
fi
echo

# --- shape validator ---------------------------------------------------------
validate_transcript() {
  local label="$1"
  local file="$2"
  python3 - "$file" <<'PY'
import json, sys

path = sys.argv[1]
raw = open(path).read()
try:
    data = json.loads(raw)
except json.JSONDecodeError as e:
    print(f"not JSON: {e}")
    sys.exit(2)

# Allow either bare TranscriptResult or { success, data } envelope
payload = data
if isinstance(data, dict) and "success" in data:
    if data.get("success") is not True:
        print(f"envelope success!=true: {data.get('error')!r}")
        sys.exit(3)
    payload = data.get("data")

if not isinstance(payload, dict):
    print(f"expected object transcript, got {type(payload).__name__}")
    sys.exit(4)

required = ("storyId", "sessionId", "words", "fullText", "durationMs")
missing = [k for k in required if k not in payload]
if missing:
    print(f"missing keys: {missing}")
    sys.exit(5)

errors = []
if not isinstance(payload["storyId"], str) or not payload["storyId"]:
    errors.append("storyId must be non-empty string")
if not isinstance(payload["sessionId"], str) or not payload["sessionId"]:
    errors.append("sessionId must be non-empty string")
if not isinstance(payload["fullText"], str):
    errors.append("fullText must be string")
if not isinstance(payload["durationMs"], (int, float)) or payload["durationMs"] < 0:
    errors.append("durationMs must be non-negative number")
if not isinstance(payload["words"], list):
    errors.append("words must be an array")
else:
    for i, w in enumerate(payload["words"]):
        if not isinstance(w, dict):
            errors.append(f"words[{i}] not an object")
            continue
        for k in ("text", "startMs", "endMs", "confidence"):
            if k not in w:
                errors.append(f"words[{i}].{k} missing")
        if "confidence" in w and not (0 <= float(w["confidence"]) <= 1):
            errors.append(f"words[{i}].confidence out of range")

if errors:
    print("; ".join(errors))
    sys.exit(6)

print(f"ok storyId={payload['storyId']!r} words={len(payload['words'])} durationMs={payload['durationMs']}")
sys.exit(0)
PY
}

# --- 2) Direct /transcribe (FastAPI field name: audio) -----------------------
echo "2) POST $ASR_URL/transcribe (multipart, field=audio)"
asr_body="$tmpdir/transcribe.json"
asr_code=$(curl -sS -o "$asr_body" -w "%{http_code}" \
  --max-time "$TIMEOUT_SECS" \
  -F "audio=@${SAMPLE_WAV};type=audio/wav" \
  -F "storyId=${STORY_ID}" \
  -F "sessionId=${SESSION_ID}" \
  "$ASR_URL/transcribe" || echo "000")

if [[ "$asr_code" != "200" ]]; then
  fail "ASR /transcribe HTTP $asr_code (cold start? raise TIMEOUT_SECS=$TIMEOUT_SECS)" \
    "$(cat "$asr_body" 2>/dev/null)"
  # Hint if they used the Next field name by mistake
  if grep -qi 'audio' "$asr_body" 2>/dev/null; then
    info "Hint: FastAPI expects form field name 'audio' (not 'audioFile')."
  fi
else
  if out=$(validate_transcript "asr" "$asr_body"); then
    pass "ASR /transcribe → TranscriptResult ($out)"
  else
    fail "ASR /transcribe body is not TranscriptResult shape" \
      "$(echo "$out"; cat "$asr_body")"
  fi
fi
echo

# --- 3) Vercel /api/asr proxy (Next field name: audioFile) -------------------
echo "3) POST $WEB_URL/api/asr (multipart, field=audioFile)"
web_body="$tmpdir/api-asr.json"
web_code=$(curl -sS -o "$web_body" -w "%{http_code}" \
  --max-time "$TIMEOUT_SECS" \
  -F "audioFile=@${SAMPLE_WAV};type=audio/wav" \
  -F "storyId=${STORY_ID}" \
  -F "sessionId=${SESSION_ID}-proxy" \
  -F "referenceText=${REFERENCE_TEXT}" \
  "$WEB_URL/api/asr" || echo "000")

if [[ "$web_code" != "200" ]]; then
  fail "Vercel /api/asr HTTP $web_code" "$(cat "$web_body" 2>/dev/null)"
  info "Common causes:"
  info "  - TALESHIFT_ASR_SERVICE_URL missing/wrong on Vercel"
  info "  - ASR cold-start timeout (proxy 503 / 'Could not reach the ASR service')"
  info "  - form field mismatch: browser→Next uses audioFile; Next→ASR must send 'audio'"
else
  if out=$(validate_transcript "web" "$web_body"); then
    pass "Vercel /api/asr → { success: true, data: TranscriptResult } ($out)"
  else
    fail "Vercel /api/asr body is not success+TranscriptResult" \
      "$(echo "$out"; cat "$web_body")"
  fi
fi
echo

# --- Summary -----------------------------------------------------------------
echo "=== Summary: $PASS passed, $FAIL failed ==="
if (( FAIL > 0 )); then
  echo
  echo "Flags to debug together:"
  for f in "${FLAGS[@]}"; do
    printf '  - %s\n' "$f"
  done
  exit 1
fi

echo "All smoke checks passed."
exit 0
