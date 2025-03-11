import PeerList from "@/components/homePage/PeerList";
import {Suspense} from "react";
import FriendList from "@/components/homePage/FriendList";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import { Devices, UsersThree } from "../shared/Icons";


function StartScreen() {

    return (
        <section className={"flex flex-col gap-5 flex-1 overflow-y-auto overflow-x-hidden"}>
            <Tabs defaultValue={"friends"} className={"w-full [direction:rtl] flex-1"}>
                <TabsList className={"w-full rounded-none"}>
                    <TabsTrigger value={"friends"}>
                        <UsersThree className={"size-5"} />
                        دوستان
                        </TabsTrigger>
                    <TabsTrigger value={"others"}>
                        <Devices className={"size-5"} />
                        دستگاه های متصل
                        </TabsTrigger>
                </TabsList>
                <TabsContent value={"friends"}>
                    <Suspense>
                        <FriendList/>
                    </Suspense>
                </TabsContent>
                <TabsContent value={"others"}>
                    <Suspense>
                        <PeerList/>
                    </Suspense>
                </TabsContent>
            </Tabs>
        </section>
    );
}

export default StartScreen;