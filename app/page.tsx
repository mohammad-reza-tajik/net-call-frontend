import Toolbar from "@/components/shared/Toolbar";
import MainScreen from "@/components/shared/MainScreen";
import Header from "@/components/shared/Header";
import Drawer from "@/components/shared/Drawer";

export default function Home() {
  return (
    <main className={"flex flex-col w-screen h-screen"}>
        <Drawer />
        <Header />
        <MainScreen />
        <Toolbar />
    </main>
  );
}
