import Image from "next/image";
import { Button } from "./ui/button";

const Hero = () => {
  return (
    <div className="text-white">
      <div className="flex justify-center flex-col items-center p-15">
        <Image
          className="h-50 ml-15 sm:h-70 rounded-3xl sm:ml-25"
          src="/hero.png"
          alt="hero"
          width={400}
          height={400}
        />
        <span className="text-3xl text-center mt-5">Split That Bill!</span>
        <span className="text-2xl text-center mt-2">
          We will help you split that annoying bill that no one wants to
          calculate
        </span>
      </div>
      <div className="flex justify-center gap-8">
        <Button variant="outline" className="text-black cursor-pointer">
          Create Group
        </Button>
        <Button className="cursor-pointer">Go to Dashboard</Button>
      </div>
    </div>
  );
};

export default Hero;
