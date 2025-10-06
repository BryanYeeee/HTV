'use client'
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import request from "@/utils/request";
import Cookies from "js-cookie";

export default function VoiceChatbot() {
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // refs
  const isRecordingRef = useRef(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const dataArrayRef = useRef(null);
  const rafIdRef = useRef(null);
  const silenceStartRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = sendAudioToBackend;

      // Web Audio API setup
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048; // larger buffer for more stable RMS
      const dataArray = new Uint8Array(analyser.fftSize);

      source.connect(analyser);

      // store refs
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;
      dataArrayRef.current = dataArray;

      // start detection + recording
      setIsListening(true);
      isRecordingRef.current = true;
      setIsRecording(true);
      mediaRecorder.start();

      // start the silence detection loop
      detectSilence();
    } catch (err) {
      console.error("Mic error:", err);
      alert("Please allow microphone access.");
    }
  };

  // compute RMS from time-domain data (0.0 - ~1.0)
  const computeRMS = (dataArray) => {
    // dataArray contains 0..255 values centered at 128 for time domain
    let sumSq = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const v = (dataArray[i] - 128) / 128; // normalize to -1..1
      sumSq += v * v;
    }
    return Math.sqrt(sumSq / dataArray.length);
  };

  const detectSilence = (silenceThreshold = 0.02, silenceDelay = 1200) => {
    // silenceThreshold: rms below which we consider it "silent"
    // silenceDelay: milliseconds of continuous silence to auto-stop

    silenceStartRef.current = null;

    const tick = () => {
      const analyser = analyserRef.current;
      const dataArray = dataArrayRef.current;

      if (!analyser || !dataArray) return;

      analyser.getByteTimeDomainData(dataArray);
      const rms = computeRMS(dataArray);

      // Debug (uncomment while tuning)
      // console.log("RMS:", rms.toFixed(4));

      const isSilent = rms < silenceThreshold;

      if (isSilent && isRecordingRef.current) {
        if (!silenceStartRef.current) {
          silenceStartRef.current = performance.now();
        } else {
          if (performance.now() - silenceStartRef.current > silenceDelay) {
            // auto-stop
            stopRecording();
            return;
          }
        }
      } else {
        silenceStartRef.current = null;
      }

      // schedule next check if still recording
      if (isRecordingRef.current) {
        rafIdRef.current = requestAnimationFrame(tick);
      }
    };

    // start loop
    rafIdRef.current = requestAnimationFrame(tick);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecordingRef.current) {
      // stop the recorder
      mediaRecorderRef.current.stop();

      // update flags + cleanup
      isRecordingRef.current = false;
      setIsRecording(false);
      setIsListening(false);

      // stop animation frame
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }

      // close audio context
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (e) {
          /* ignore */
        }
        audioContextRef.current = null;
        analyserRef.current = null;
        sourceRef.current = null;
        dataArrayRef.current = null;
      }
    }
  };

  const sendAudioToBackend = async () => {
    // create blob
    const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });

    const formData = new FormData();
    formData.append("audio", blob, "recording.webm");
    formData.append("username", Cookies.get('username'));

    try {
      // use request helper that supports FormData
      const res = await request.post("/audio/upload_audio", formData, { responseType: "blob" });
      const audioBlob = res instanceof Blob ? res : new Blob([res]);
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (err) {
      console.error("Error sending audio:", err);
      alert("Error processing audio.");
    } finally {
      // clear recorded chunks
      audioChunksRef.current = [];
    }
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
