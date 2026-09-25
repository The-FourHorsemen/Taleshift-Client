import Image from "next/image";
import { TeacherSideNav } from "@/components/layout/teacher/TeacherSideNav";
import { Button } from "@/components/ui/Button";
import { OverallProgressCard } from "@/components/dashboard/teacher/OverallProgressCard";
import { BreakdownCard } from "@/components/dashboard/teacher/BreakdownCard";

export default function TeacherOverviewPage() {
  return (
    <div className="flex min-h-screen items-start justify-center bg-app-bg pl-64">
      <TeacherSideNav active="Overview" />

      <main className="flex w-full flex-1 flex-col items-start gap-8 p-10">
        <div className="w-full max-w-[1280px]">
          <div className="flex w-full items-end justify-between border-b border-border-default pb-[17px]">
            <div>
              <h1 className="font-display text-[40px] font-bold leading-[48px] tracking-[-0.8px] text-text-primary">
                Grade 4A Overview
              </h1>
              <p className="text-lg text-text-secondary">Monitoring 24 Learners in real-time.</p>
            </div>
            <div className="flex items-start gap-4">
              <Button variant="outline" icon={<Image src="/icons/teacher-dashboard/calendar.svg" alt="" width={13.5} height={15} />}>
                This Week
              </Button>
              <Button icon={<Image src="/icons/teacher-dashboard/download.svg" alt="" width={12} height={12} />}>
                Export Report
              </Button>
            </div>
          </div>

          <div className="mt-8 grid w-full grid-cols-4 gap-6">
            <OverallProgressCard percent={78} deltaLabel="+5%" />
            <BreakdownCard value={12} label="On Track" icon="/icons/teacher-dashboard/check-circle.svg" iconWidth={20} iconHeight={20} iconBg="#6cf8bb" />
            <BreakdownCard value={8} label="Excelling" icon="/icons/teacher-dashboard/award.svg" iconWidth={16} iconHeight={21} iconBg="#d8e2ff" />
            <BreakdownCard
              value={4}
              label="Needs Support"
              icon="/icons/teacher-dashboard/alert-triangle.svg"
              iconWidth={22}
              iconHeight={19}
              iconBg="#ffdad6"
              tone="danger"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
