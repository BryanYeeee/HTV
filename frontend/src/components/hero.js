"use client"

import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react";
import { useRef, useState, useMemo, useCallback } from "react";
import { PillRender } from '@/components/scene'

gsap.registerPlugin(ScrambleTextPlugin)
gsap.registerPlugin(SplitText);
gsap.registerPlugin(useGSAP)

const Hero = ({ pages }) => {
    const heroRef = useRef()
    const pillRef = useRef();
    const tl = useRef()
    const tl2 = useRef()
    const [dropping, setDropping] = useState(true)
    const [showLogin, setShowLogin] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = () => {
        setIsChecked(prev => !prev);
    };

    useGSAP(() => {
        const split = new SplitText("#largeText", {
            type: "words, chars",
            wordsClass: "word",
            charsClass: "char"
        });

        gsap.set("#heartbeat-path", {
            strokeDasharray: 1000,
            strokeDashoffset: 2000,
            opacity: 0,
        });

        tl.current = gsap.timeline({ paused: false })
            .to('#graphic', { height: 'auto', ease: 'power4.inOut', duration: 1.2 })
            .from('.titlebord', { duration: 1.5, xPercent: 100, opacity: 0 }, 'o')
            .from('#menu', { duration: 1, y: -50, opacity: 0 }, 'p')
            .from(split.chars, { opacity: 0, y: 50, stagger: 0.01, duration: 1.2, ease: 'power4.out' }, 'o')
            .from('#theRest', { opacity: 0, yPercent: -100, ease: 'expo.out', duration: 1.2 }, 'o')
            .to('#theRest', { opacity: 1, yPercent: 0, ease: 'expo.out', duration: 1.2 }, 'o')
            .from('#goose', { opacity: 0, ease: 'bounce.inOut', duration: 0.8 }, 'p')
            .to('#goose', { opacity: 1, ease: 'bounce.inOut', duration: 0.8 }, 'p')
            .to('#menu', {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: 'power2.out'
            }, 'p+=0.5') // Added proper fade in for menu
            .to('#heroText', { top: '0%', yPercent: 100, scale: 1.5, ease: 'power4.out', duration: 1.4 }, 'p')
            .to("#heartbeat-path", {
                opacity: 1,
                duration: 0.5
            })
            .call(() => {
                gsap.to("#heartbeat-path", {
                    strokeDashoffset: 0,
                    duration: 3,
                    ease: "none",
                    repeat: -1
                });
            });

    }, { scope: heroRef })


    const MomoGoose = useMemo(() => (
        <PillRender ref={pillRef} />
    ), [dropping]);


    const start = useCallback((state) => {
        if (pillRef.current && typeof pillRef.current.triggerSeparation === 'function') {
            pillRef.current.triggerSeparation(state);
        }

        setTimeout(() => {
            setShowLogin(true);
            gsap.to("#menu", { scale: 1.05, duration: 1, ease: "power2.inOut" });
        }, 1000);

    }, []);

    const handleLogin = (e) => { //boss' code
        e.preventDefault();

        const formData = new FormData(e.target);
        const username = formData.get("username");
        const password = formData.get("password");

        console.log("Logging in with:", { username, password });

        if (pillRef.current && typeof pillRef.current.triggerSeparation === 'function') {
            pillRef.current.triggerSeparation("separate");
        }

        gsap.to("#menu", { scale: 1.1, duration: 0.6, ease: "power3.out" });

    };


    return (
        <div ref={heroRef} className="relative w-full h-screen flex flex-col select-none">
            <div id="title" className="flex flex-col w-full h-full absolute">
                <div id="graphic" className="shrink-0 flex-grow h-[calc(100vh-20px)] w-full box-border relative">

                    <svg
                        id="heartbeat-line"
                        className="absolute top-1/4 left-0 w-full h-1/2 pointer-events-none z-0"
                        viewBox="0 0 1000 100"
                        preserveAspectRatio="none"
                    >
                        <path
                            id="heartbeat-path"
                            fill="none"
                            stroke="#c7f4ffff"
                            strokeWidth="2"
                            d="M0,50 L100,50 L130,10 L160,100 L200,50 L300,50 L330,30 L360,70 L400,50 L600,50 L630,20, L660,50 L1000,50"
                            style={{ filter: 'drop-shadow(0 0 4px #8fd0ffff)' }}
                        />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">

                        <div id="heroText" className="absolute h-auto w-auto z-10 flex md:items-start items-center justify-center px-15 overflow-hidden">
                            <div id="largeText" className="flex flex-col md:items-start items-center justify-center">
                                <div className="font-extrabold lg:text-[4vw] text-[7vw]">
                                    SELFPHARMA
                                </div>
                            </div>
                        </div>

                        <div id="menu" className="border rounded-xl z-10 w-auto h-auto opacity-0 bg-white/80 p-4 backdrop-blur-md shadow-lg">
                            <div className="flex flex-col items-center gap-4 transition-all duration-500 ease-in-out">
                                {!showLogin ? (
                                    <button
                                        className="border rounded-xl font-bold text-[2vw] p-3 bg-black text-[#ead3d3] 
                hover:bg-white hover:text-black hover:scale-105 
                transition-all duration-300 ease-in-out"
                                        onClick={() => start("hori")}
                                    >
                                        GET STARTED
                                    </button>
                                ) : (
                                    <form className="flex flex-col gap-4 items-center w-full p-4"
                                        onSubmit={handleLogin}>
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            className="w-full px-4 py-2 rounded-md border border-gray-300 text-black"
                                        />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            className="w-full px-4 py-2 rounded-md border border-gray-300 text-black"
                                        />
                                        <button
                                            type="submit"
                                            className="w-full px-4 py-2 rounded-md bg-black text-white font-bold hover:bg-gray-800 transition-all"
                                        >
                                            LOGIN
                                        </button>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="option1"
                                                checked={isChecked}
                                                onChange={handleCheckboxChange}
                                            />
                                            <label htmlFor="option1" className="text-black cursor-pointer">
                                                I am a Pharmacist
                                            </label>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </div>

                        <div id="goose" className="absolute w-full h-full ml-auto z-1">
                            <div className="w-full h-full lg:opacity-100 opacity-30">
                                {MomoGoose}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}

export default Hero;