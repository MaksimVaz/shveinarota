"use client";

import { motion } from "framer-motion"
import InfoBlock from '$component/info/InfoBlock/InfoBlock';
import CardBlock from '$component/info/CardBlock/CardBlock';
import ConBlock from '$component/info/ConBlock/ConBlock';
import OrderBlock from '$component/info/OrderBlock/OrderBlock';
import PartnersBlock from '$component/info/PartnersBlock/PartnersBlock';
import dynamic from "next/dynamic";
const MapBlock = dynamic(() => import('$component/info/MapBlock/MapBlock'), { ssr: false });
import MediaBlock from "$component/info/MediaBlock/MediaBlock";

export default function HomePage() {
  return (
    <>
      <main className='main'>
        <InfoBlock />
        <OrderBlock />
        <ConBlock />
        <CardBlock />
        <MediaBlock />
        <PartnersBlock />
        <MapBlock />
      </main>
    </>
  );
}