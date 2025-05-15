"use client";
import VolunteerModal from "@/components/events/volunteer";
import { Button } from "@/components/ui/button";
import SkeletonCard from "@/components/ui/skeletoncard";
import bgfooterImage from "@/public/assets/Footer-Hexa-Spiral.png";
import bgImageHero from "@/public/assets/Hero-Hexa-Spiral.png";
import ElikitaTransparentLogo from "@/public/assets/Logo Transparency.webp";
import bgImageService from "@/public/assets/Specialties-Section-Hexa-Spiral.png";
import herotwo from "@/public/assets/about-image.webp";
import ahcdLogo from "@/public/assets/afcicon.png";
import daalitechLogo from "@/public/assets/dalitechicon.png";
import dechilogo from "@/public/assets/dhtflogo.png";
import drsadiq from "@/public/assets/drsadiq.jpg";
import heroone from "@/public/assets/hero-image.webp";
import herothree from "@/public/assets/services-image.webp";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BsTwitterX } from "react-icons/bs";
import { FaCogs } from "react-icons/fa";
import { LiaCheckSquareSolid } from "react-icons/lia";
import { MdOutlineDevices } from "react-icons/md";
import { PiLightbulbThin } from "react-icons/pi";
import AppLogo from "../../public/assets/Logo.svg";
import {createAuditLogEntry,createSession} from "@/components/shared/api";

import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/admin");
    }
  }, [status, router]);
  const startUserSession = async (userId) => {
    const sessionData = {
      userId,
      lastHeartbeat: new Date(),
      isActive: true,
    };
  
    try {
      const response = await createSession(sessionData);
      console.log("Session created successfully:", response);
      return response;
    } catch (error) {
      console.error("Failed to create session:", error);
      throw error;
    }
  };
  const auditData = {
    userId: session?.data?.user?.id,
    activityType: "Login",
    entityId: session?.data?.user?.id,
    entityModel: "Staff",
    details: "User logged in successfully",
  };


  const handleLogin = async () => {
    setLoading(true);

    try {
      await signIn("azure-ad", {
        callbackUrl: "/admin",
      });
     
     // await createAuditLogEntry(auditData);
     // startUserSession(session?.data?.user?.id)
      
    } catch (error) {
      console.error("Login failed:", error);
    }finally {
      setLoading(false);
    }
  };

  if (status === "authenticated") {
    return <SkeletonCard />;
  }

  const services = [
    {
      icon: <MdOutlineDevices />,
      title: "Remote Consultations",
      className: "bg-white",
    },
    {
      icon: <FaCogs />,
      title: "AI Powered Diagnosis",
      className: "bg-white",
    },
    {
      icon: <LiaCheckSquareSolid />,
      title: "Treatment Validation",
      className: "bg-white",
    },
    {
      icon: <PiLightbulbThin />,
      title: "Healthcare Education",
      className: "bg-white",
    },
  ];

  const submitEmail = async (e) => {
    e.preventDefault();

    handleSubmit({ email });

    setEmail("");
    toast({
      title: "Subscribed successfully",
      message: "Subscribed successfully",
    });
  };

  return (
    <div className="min-h-screen bg-[#F4FFFB]">
      <div className="h-8 w-full bg-[#007664]"> </div>
      <nav className="p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Image src={AppLogo} alt="e-Likita Logo" className="h-10" />
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            <Link
              href="#home"
              className="font-inter text-base font-normal text-[#2D2E2E]"
            >
              Home
            </Link>
            <Link
              href="#about"
              className="font-inter text-base font-normal text-[#2D2E2E]"
            >
              About Us
            </Link>
            <Link
              href="/events"
              className="font-inter text-base font-normal text-[#2D2E2E]"
              prefetch={true}
            >
              Events
            </Link>
            <Link
              href="#contact"
              className="font-inter text-base font-normal text-[#2D2E2E]"
            >
              Contact Us
            </Link>
          </div>

          <div className="hidden items-center space-x-4 md:flex">
          <Button
  className="flex items-center justify-center rounded-lg border border-white bg-[#3A4F39] px-4 py-2 text-white disabled:opacity-50"
  onClick={handleLogin}
  disabled={loading}
>
{loading ? "Signing in..." : "Sign In"}
</Button>


            <VolunteerModal />
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-green-600"
            >
              <svg
                className="size-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            <Link href="#home" className="block py-2 text-[#2D2E2E]">
              Home
            </Link>
            <Link href="#about" className="block py-2 text-[#2D2E2E]">
              About Us
            </Link>
            <Link
              href="/events"
              className="block py-2 text-[#2D2E2E]"
              prefetch={true}
            >
              Events
            </Link>
            <Link href="#contact" className="block py-2 text-[#2D2E2E]">
              Contact Us
            </Link>
            <div className="mt-4 space-y-2">
            <button
  className="flex w-full items-center justify-center rounded-lg border border-white bg-[#3A4F39] px-4 py-2 text-white disabled:opacity-50"
  onClick={handleLogin}
  disabled={loading}
>
{loading ? "Signing in..." : "Sign In"}

</button>

         
              <VolunteerModal />
            </div>
          </div>
        )}
      </nav>

      <div className="relative bg-[#E2FFF5] py-20" id="home">
        <Image
          src={bgImageHero.src}
          alt="bg hero"
          fill={true}
          className="absolute w-full opacity-20"
        />

        <div className="my-5 flex flex-col items-center justify-center px-4 md:flex-row md:items-center md:justify-center">
          <div className="relative w-full  md:w-2/4">
            <h1 className="text-center font-urbanist text-[30px] font-normal text-black md:text-left  md:text-[70px] md:leading-[75px]">
              A platform that <br /> bridges{" "}
              <span className="font-extrabold text-[#007664]">
                Healthcare
                <br />{" "}
              </span>{" "}
              delivery gaps.
            </h1>
          </div>
          <div className="relative w-full md:w-1/3">
            <div className="rotate-3 rounded-3xl  p-2">
              <Image
                src={heroone}
                alt="Telemedicine Session"
                className="w-[500px] rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative my-40 flex flex-col items-center  justify-center px-4 md:flex-row md:items-center md:justify-center"
        id="about"
      >
        <Image
          src={ElikitaTransparentLogo.src}
          alt="bg hero"
          fill={true}
          className="absolute w-full opacity-10"
          objectPosition="center"
          objectFit="contain"
        />
        <div className="relative w-full md:w-1/3">
          <div className="relative">
            <div className="absolute -left-4 -top-4 size-full rounded-3xl"></div>
            <div className="absolute -bottom-4 -right-4 size-full rounded-3xl "></div>
            <Image
              src={herotwo}
              alt="Doctor Consultation"
              className="relative z-10 w-[500px] rounded-2xl"
            />
          </div>
        </div>

        <div className="relative w-full bg-[#F4FFFB] md:w-1/3">
          <h2 className="mb-2 font-poppins text-xl font-bold text-[#007664]">
            ABOUT US
          </h2>
          <h3 className="mb-4 text-wrap font-urbanist text-[32px] font-semibold md:text-nowrap">
            Strengthening Healthcare Systems
          </h3>
          <p className="mb-8 font-urbanist text-[18px] font-medium text-[#007664]">
            Built to integrate seamlessly into existing healthcare systems,
            e-Likita strengthens frontline healthcare workers with intuitive
            digital tools and enables real-time collaboration with experts.
          </p>

          <div className="flex items-center gap-4">
            <Image
              src={drsadiq}
              alt="Dr. Muhammad Saddiq"
              className="size-12 rounded-full"
            />
            <div>
              <p className="font-urbanist text-[12px] font-bold italic text-[#3A4F39]">
                &quot;Our goal is to bridge gaps in healthcare delivery, making
                quality healthcare more accessible, efficient, and
                sustainable&quot;
              </p>
              <p className="mt-1 font-urbanist text-[14px] font-medium text-[#3A4F39]">
                Dr. Muhammad Saddiq
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="relative my-40 flex w-full flex-col items-center justify-center gap-20 bg-[#E2FFF5] px-4 md:flex-row md:items-center md:justify-center"
        id="services"
      >
        <Image
          src={bgImageService.src}
          alt="bg hero"
          fill={true}
          className="absolute w-full opacity-20"
        />
        <div className="relative w-full  md:w-1/3">
          <div className="mb-16 w-full">
            <h2 className="mb-2 font-poppins text-xl font-bold text-[#007664]">
              Services
            </h2>
            <h3 className="mb-4 font-urbanist text-4xl font-bold text-[#042B20]">
              We have a wide range of features
            </h3>
            <p className="w-4/5 font-urbanist font-normal text-[#3A4F39]">
              Through e-Likita, we are bridging healthcare delivery gaps,
              ensuring quality healthcare reaches underserved communities while
              fostering continuous learning and knowledge sharing.
            </p>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <div
                key={index}
                className={`flex w-full flex-col items-center justify-center gap-1 rounded-lg ${index === 1 ? "bg-[#FFFBF2]" : "border  border-[#006633] bg-[#F4FFFB]"} p-6 text-[#006633] shadow-md transition-shadow hover:shadow-lg`}
              >
                <div className="font-bold">{service.icon}</div>
                <h4 className="text-center font-inter text-[12px] font-bold ">
                  {service.title}
                </h4>
              </div>
            ))}
          </div>
        </div>

        <div className="relative w-full md:w-1/3">
          <div className="relative">
            <Image
              src={herothree}
              alt="Doctor Consultation"
              className="relative z-10 w-full rounded-2xl"
            />
          </div>
        </div>
      </div>

      <div className="relative my-40 flex w-full flex-col items-center justify-center gap-20 px-4 md:flex-row md:items-center md:justify-center">
        <Image
          src={ElikitaTransparentLogo.src}
          alt="bg hero"
          className="absolute  opacity-10"
          objectPosition="center"
          objectFit="contain"
          width={600}
          height={600}
        />
        <div className="relative flex w-full items-center justify-center bg-[#E2FFF5] p-4 md:w-1/3">
          <div className="w-full max-w-4xl space-y-8">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex size-16 items-center justify-center overflow-hidden rounded-full ">
                <Image
                  src={ahcdLogo}
                  alt="doctorimg"
                  className="size-12 rounded-full border"
                />
              </div>
              <div className="flex w-full flex-col  items-center justify-center text-center">
                <Link href="https://ahdt.co.uk/">
                  <h2 className="mt-4 text-xl font-bold text-[#1a3b2d]">
                    Africa Health Care Development Trust
                  </h2>
                </Link>
                <p className="text-center font-urbanist text-xl  leading-relaxed text-[#5D775B]">
                  A network of expert healthcare specialists offering medical
                  guidance and mentorship.
                </p>
              </div>
            </div>

            <div className="flex w-full flex-col items-center justify-center gap-8 rounded-3xl bg-white p-8 shadow-lg">
              <div className="flex size-16 items-center justify-center overflow-hidden rounded-full ">
                <Image
                  src={dechilogo}
                  alt="doctorimg"
                  className="size-12 rounded-full border"
                />
              </div>
              <div className="flex w-full flex-col items-center justify-center">
                <Link href="https://dechihtf.org/">
                  <h2 className="text-center text-xl  font-bold text-[#1a3b2d]">
                    Dechi Health Trust Fund
                  </h2>
                </Link>
                <p className="mb-4 text-center font-urbanist text-xl leading-relaxed text-[#5D775B] ">
                  The pioneer behind this digital health initiative, dedicated
                  to ensuring equitable access to quality healthcare and
                  affordability in rural Nigeria.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-2">
              <div className="flex size-16 items-center justify-center overflow-hidden rounded-full ">
                <Image
                  src={daalitechLogo}
                  alt="doctorimg"
                  className="size-12 rounded-full border"
                />
              </div>
              <div className="max-w-2xl">
                <Link href="https://www.daalitech.com/">
                  <h2 className="mt-4 text-center text-xl font-bold text-[#1a3b2d]">
                    DAALITech
                  </h2>
                </Link>
                <p className="text-center font-urbanist text-xl leading-relaxed text-[#5D775B]">
                  A Data and AI startup spearheading the technological
                  development of the project.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative flex w-full flex-col items-center  justify-center p-4 md:w-1/3 md:items-start">
          <h2 className="mb-2 text-center font-poppins text-xl font-bold text-[#007664] md:text-left">
            Collaborations
          </h2>
          <h3 className="mb-6 text-wrap text-center font-urbanist text-4xl font-semibold md:text-nowrap md:text-left">
            Partners & Supporters
          </h3>
          <p className="font-urbanist text-[18px] font-normal text-[#3A4F39]">
            e-Likita was built through a collaboration between Dechi Health
            Trust Fund, Africa Health Care Development Trust, and DAALITech,
            with the support of dedicated Microsoft volunteers through the
            Microsoft Global Hackathon.
          </p>
        </div>
      </div>

      <div
        className="flex w-full items-center justify-center bg-[#E8F3F1] py-20"
        id="contact"
      >
        <div className="flex w-full flex-col items-center justify-center rounded-3xl bg-[#FFFFFF] p-8 shadow-lg md:w-2/3">
          <h2 className="mb-2 text-center text-[36px] font-semibold text-[#042B20]">
            Stay in touch
          </h2>
          <p className="mb-8 text-center font-urbanist font-medium text-[#3A4F39]">
            Subscribe to get access to exclusive updates and stay tuned for news
          </p>
          <form
            onSubmit={submitEmail}
            className="mb-5 flex w-2/3 flex-col   md:flex-row md:items-center md:justify-start"
          >
            <input
              id="email"
              type="email"
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              placeholder="Enter your email address"
              className="w-full flex-1 bg-[#EDEDED] px-4 py-3 text-[#A0A0A0] focus:outline-none focus:ring-2 focus:ring-[#2B5845] md:w-1/5"
              required
            />
            <button
              type="submit"
              className=" bg-[#3A4F39] px-8 py-3 text-[#FFFFFF] transition-colors hover:bg-[#234736]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <footer className="relative bg-[#007664] py-16 text-[#FFFFFF] ">
        <Image
          src={bgfooterImage}
          alt="bg hero"
          fill={true}
          className="absolute z-0 opacity-20"
        />
        <div className="container z-10 mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="space-y-6">
              <Image src={AppLogo} alt="e-Likita Logo" className="h-12" />
              <p className="text-gray-300">
                Harnessing the power of tech to bridge healthcare delivery gaps
                by providing clinical decision support to the health workers.
              </p>
              <div className="relative z-50 flex items-center space-x-2">
                <a
                  href="mailto:contact@e-likita.com"
                  className="flex flex-nowrap items-center gap-2 text-nowrap"
                >
                  <svg
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  contact@e-likita.com
                </a>
              </div>
            </div>

            <div className="md:ml-auto">
              <h3 className="mb-6 text-xl font-semibold">e-Likita</h3>
              <ul className="relative z-50 space-y-4">
                <li>
                  <Link href="#about" className="hover:text-gray-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/events" className="hover:text-gray-300">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-gray-300">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#services" className="hover:text-gray-300">
                    Services
                  </Link>
                </li>
              </ul>
            </div>

            <div className="relative z-50">
              <h3 className="mb-6 text-xl font-semibold">Follow us</h3>
              <div className="flex space-x-4">
                <Link
                  href="https://www.facebook.com/profile.php?id=61572894154017"
                  className="hover:text-gray-300"
                >
                  <svg
                    className="size-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                  </svg>
                </Link>
                <Link
                  href="https://x.com/eLikita_app?t=tdRRKxFV16pag5MMIJP-UA&s=09"
                  className="hover:text-gray-300"
                >
                  <BsTwitterX size={24} />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/e-likita/"
                  className="hover:text-gray-300"
                >
                  <svg
                    className="size-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className=" flex flex-col items-center justify-between border-t border-gray-700 bg-[#3A4F39] px-2 py-8  md:flex-row md:px-20">
        <p className="text-sm text-gray-400">
          e-Likita Copyright 2025 | All Rights Reserved
        </p>
        <div className="mt-4 flex space-x-6 md:mt-0">
          <a
            href="https://www.microsoft.com/en-US/privacy/privacystatement"
            className="text-sm text-gray-400 hover:text-white"
          >
            Privacy Policy
          </a>
          <a
            href="https://www.microsoft.com/en-US/servicesagreement/"
            className="text-sm text-gray-400 hover:text-white"
          >
            Terms of Use
          </a>
        </div>
      </div>
    </div>
  );
}
