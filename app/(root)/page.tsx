import CTA from "@/components/sections/cta";
import Features from "@/components/sections/features";
import {Hero} from "@/components/sections/hero"
import Testimonials from "@/components/sections/testimonials"



export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="flex-grow">
        <Hero />
        <Features /> 
         {/* <HowItWorks />  */}
         {/* <Testimonials />  */}
         <CTA />
      </main>
 
    </div>
  );
}