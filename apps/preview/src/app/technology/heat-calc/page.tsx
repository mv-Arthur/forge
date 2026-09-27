import { DETAIL_CALC_TITLE, HEAT_CALC_PAGE_LEAD } from "@/lib/copy";
import { HeatCalc } from "@/widgets/heat-calc/heat-calc";
import { HeatCalcHub } from "@/widgets/heat-calc-hub/heat-calc-hub";

export const metadata = {
    title: `${DETAIL_CALC_TITLE} · Новый Коттедж`,
    description: HEAT_CALC_PAGE_LEAD,
};

export default function HeatCalcPage() {
    return <HeatCalcHub form={<HeatCalc layout="page" />} />;
}
