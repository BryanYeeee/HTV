'use client'
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import request from "@/utils/request";

export default function VoiceChatbot() {
    const [isRecording, setIsRecording] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const silenceTimerRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const sourceRef = useRef(null);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            // 🎙️ VOLUME DETECTION SETUP
            const audioContext = new AudioContext();
            const source = audioContext.createMediaStreamSource(stream);
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 512;
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            source.connect(analyser);
            audioContextRef.current = audioContext;
            analyserRef.current = analyser;
            sourceRef.current = source;

            // 🔉 Start listening for silence
            setIsListening(true);
            detectSilence(analyser, dataArray);

            mediaRecorder.ondataavailable = (e) => {
                audioChunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = sendAudioToBackend;

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Mic error:", err);
            alert("Please allow microphone access.");
        }
    };

    const detectSilence = (analyser, dataArray, silenceThreshold = 5, silenceDelay = 2000) => {
        let silenceStart = null;

        const checkSilence = () => {
            analyser.getByteFrequencyData(dataArray);
            const avg = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
            const isSilent = avg < silenceThreshold;

            if (isSilent && isRecording) {
                if (!silenceStart) silenceStart = Date.now();
                else if (Date.now() - silenceStart > silenceDelay) {
                    console.log("Silence detected — stopping...");
                    stopRecording();
                    return;
                }
            } else {
                silenceStart = null; // reset timer
            }

            if (isRecording) requestAnimationFrame(checkSilence);
        };

        checkSilence();
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsListening(false);

            // cleanup
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        }
    };

    const sendAudioToBackend = async () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", blob);

        const res = await request.post("/query_audio", {
            body: formData,
        }).then(async res => {
            console.log("Backend response:", res);
            if (!res.ok) throw new Error("Backend error");

            const audioBlob = await res.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
        }).catch(err => {
            console.error("Error sending audio:", err);
            alert("Error processing audio.");
        });


    
  };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
            <motion.button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center text-white text-3xl 
          ${isRecording ? "bg-red-500 animate-pulse" : "bg-indigo-600 hover:bg-indigo-700"}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {isRecording ? "🎙️" : "💬"}
            </motion.button>

            <motion.div
                className="text-sm text-gray-700 mt-2 text-center font-medium"
                animate={{ opacity: isRecording ? 1 : 0 }}
                transition={{ duration: 0.3 }}
            >
                {isListening ? "Listening..." : ""}
            </motion.div>
        </div>
    );
}
