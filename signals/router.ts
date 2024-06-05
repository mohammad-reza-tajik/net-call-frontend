import {signal} from "@preact/signals-react";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";

const routerSignal = signal<AppRouterInstance | undefined>(undefined);

export default routerSignal;