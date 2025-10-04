"use client"

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LoopSubdivision } from "three-subdivide";
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';



export const PillRender = forwardRef((props, ref) => {
    const containerRef = useRef()
    const pillRef = useRef(null);
    const stateRef = useRef("default");

    useImperativeHandle(ref, () => ({
        triggerSeparation: () => {
            console.log("AAAA");
            if (!pillRef.current) return
            stateRef.current = "seperate"

        }
    }));

    useEffect(() => {



        if (typeof window === 'undefined') return
        if (!containerRef.current) return;

        let camera, scene, renderer, composer;
        let directionalLight;
        let outlinePass;

        let gradientMap;
        const params = {
            split: true,       // optional, default: true
            uvSmooth: false,      // optional, default: false
            preserveEdges: false,      // optional, default: false
            flatOnly: false,      // optional, default: false
            maxTriangles: Infinity,   // optional, default: Infinity
        };

        let animationId;
        let mouthOpen = false;
        let mouthProgress = 0;
        let mouthSpeed = 0.2;
        let mouthDirection = 1;
        let curOpens = 20;
        let dist = 30;



        const observer = new ResizeObserver((entries) => { // ???
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (width > 0 && height > 0) {
                    if (!renderer) {
                        init(width, height);
                        animate();
                    } else {
                        resize(width, height);
                    }
                }
            }
        });
        observer.observe(containerRef.current);

        function init(width, height) {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
            camera.position.z = 5;

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setClearColor(0xFFFFFF, 0);
            renderer.setSize(
                width,
                height
            );
            renderer.localClippingEnabled = true;
            containerRef.current.appendChild(renderer.domElement);


            composer = new EffectComposer(renderer);

            const renderScene = new RenderPass(scene, camera);
            composer.addPass(renderScene);


            outlinePass = new OutlinePass(
                new THREE.Vector2(width, height),
                scene,
                camera
            );
            outlinePass.edgeStrength = 10.0;
            outlinePass.edgeGlow = 0.0;
            outlinePass.edgeThickness = 1.0;
            outlinePass.visibleEdgeColor.set("#ED6A5A"); // outline color
            outlinePass.hiddenEdgeColor.set("#000000");
            outlinePass.selectedObjects = []
            composer.addPass(outlinePass);

            const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1);
            scene.add(ambientLight);

            directionalLight = new THREE.DirectionalLight(0xffcf30, 3);
            directionalLight.position.set(3, 5, 0);
            scene.add(directionalLight);


            gradientMap = new THREE.TextureLoader().load('https://threejs.org/examples/textures/gradientMaps/fiveTone.jpg');
            gradientMap.minFilter = THREE.NearestFilter;
            gradientMap.magFilter = THREE.NearestFilter;

            loadModel();
            renderer.setPixelRatio(window.devicePixelRatio);
            composer.setPixelRatio(window.devicePixelRatio);

            renderer.domElement.addEventListener("pointerdown", onMouseDown)
            // window.addEventListener("pointermove", onMouseMove)
            // window.addEventListener("pointerup", onMouseUp)
        }

        function loadModel() {
            // const upperGeometry = createHalfCapsule(0.5, 1, 8, true); // top half
            // const lowerGeometry = createHalfCapsule(0.5, 1, 8, false); // bottom half

            // const upperMaterial = new THREE.MeshToonMaterial({ color: 0xffaaaa });
            // const lowerMaterial = new THREE.MeshToonMaterial({ color: 0xffffff });

            // const upperMesh = new THREE.Mesh(upperGeometry, upperMaterial);
            // const lowerMesh = new THREE.Mesh(lowerGeometry, lowerMaterial);

            pillRef.current = new THREE.Group();
            loadCapsule(0.01, 0.5, 0xffaaaa, true)
            loadCapsule(0.01, 0.5, 0xffffff, false)


            //pill.add(upperMesh);
            //pill.add(lowerMesh);
            scene.add(pillRef.current);

        }



        function loadCapsule(gap, radius, colour, isTopHalf) {

            const direction = isTopHalf ? 1 : -1;
            const localPlane = new THREE.Plane(new THREE.Vector3(0, gap * isTopHalf, 0), 0.8);
            let geometry = new THREE.CapsuleGeometry(radius, 1, 4, 8);
            geometry = LoopSubdivision.modify(geometry, 1, params);
            const material = new THREE.MeshToonMaterial({
                color: new THREE.Color(colour),
                side: THREE.DoubleSide,
                gradientMap: gradientMap,
                emissive: new THREE.Color(0xFFFFFF),
                emissiveIntensity: 0.0,
                clippingPlanes: [localPlane],
                clipShadows: true
            });
            // const material = new THREE.MeshPhongMaterial({
            //     color: new THREE.Color(colour),
            //     clippingPlanes: [localPlane],
            //     clipShadows: true
            // });
            const capsule = new THREE.Mesh(geometry, material);
            capsule.castShadow = true;

            const capGeometry = new THREE.CircleGeometry(radius - 0.03, 32);
            const capMaterial = new THREE.MeshToonMaterial({
                color: new THREE.Color(colour),
                side: THREE.DoubleSide,
                gradientMap: gradientMap
            });

            const cap = new THREE.Mesh(capGeometry, capMaterial);

            const capOffset = 0; // Adjust to match actual center if needed
            cap.position.y = direction * capOffset;
            cap.rotation.x = isTopHalf ? Math.PI / 2 : -Math.PI / 2;

            // Add cap to capsule mesh
            capsule.add(cap);

            pillRef.current.add(capsule);



        }

        function startYap(speed, times) {
            mouthSpeed = speed
            curOpens = time
        }

        function animateMouth() {
            // Update mouth progress
            mouthProgress += mouthSpeed * mouthDirection;

            if (curOpens <= 0) return
            // Reverse direction when reaching limits
            if (mouthProgress >= 1) {
                mouthProgress = 1;
                mouthDirection = -1;
                mouthOpen = true;
            } else if (mouthProgress <= 0) {
                mouthProgress = 0;
                mouthDirection = 1;
                mouthOpen = false;
                curOpens--;
            }

            // Calculate rotation angles (in radians)
            const maxRotation = Math.PI / 4; // 45 degrees max rotation
            const topRotation = mouthProgress * maxRotation; // Rotates upward (negative X)
            const bottomRotation = -mouthProgress * maxRotation; // Rotates downward (positive X)

            // Apply rotations
            if (pillRef.current && pillRef.current.children.length >= 2) {
                const topHalf = pillRef.current.children[0];
                const bottomHalf = pillRef.current.children[1];

                // Reset rotations first
                topHalf.rotation.x = 0;
                bottomHalf.rotation.x = 0;



                // Apply hinge rotations around their local pivot points
                topHalf.rotation.x = topRotation;
                bottomHalf.rotation.x = bottomRotation;

                updateNormals(topHalf, bottomHalf, false)
            }
        }

        function animate() {
            animationId = requestAnimationFrame(animate)

            let time = Date.now() * 0.0001
            // directionalLight.position.set(
            //     Math.cos(time) * 5,
            //     0,
            //     Math.sin(time) * 5
            // );
            directionalLight.lookAt(0, 0, 0);

            switch (stateRef.current) {
                case "default":
                    updateNormals(pillRef.current, pillRef.current, true)
                    break;
                case "verti":
                    resetRotation(pillRef.current, new THREE.Quaternion())
                    updateNormals(pillRef.current, pillRef.current, true)
                    break;
                case "hori":
                    resetRotation(pillRef.current, new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2))
                    updateNormals(pillRef.current, pillRef.current, true)
                    break;
                case "seperate":
                    animateSeparate(0.1);
                    updateNormals(pillRef.current, pillRef.current, false, 1, 0)
                    break;
                case "open":
                    updateNormals(pillRef.current, pillRef.current, false);
                    animateMouth();
                    stateRef.current = curOpens <= 0 ? "hori" : stateRef.current;
                    break;
                case "seperate2":
                    animateSeparate(0.1);
                    break;

            }
            console.log(stateRef.current)




            composer.render();
        }

        function animateSeparate(speed = 1, targetDistance = 2) {
            let topHalf = pillRef.current.children[0]
            let bottomHalf = pillRef.current.children[1]
            topHalf.position.y -= speed
            bottomHalf.position.y += speed

            const currentDistance = bottomHalf.position.y - topHalf.position.y;
            const remaining = targetDistance - currentDistance;

            const easeSpeed = remaining * 0.1;

            topHalf.position.y -= easeSpeed / 2;
            bottomHalf.position.y += easeSpeed / 2;


            updateNormals(topHalf, bottomHalf, false)
            dist--;
            if (dist < 0) {
                verticalSeparateWithPrep()
            }
        }

        let verticalSeparateStage = 0;

        function verticalSeparateWithPrep() {
            if (!pillRef.current || pillRef.current.children.length < 2) return;

            const top = pillRef.current.children[0];
            const bottom = pillRef.current.children[1];

            const easeFactor = 0.1;

            if (verticalSeparateStage === 0) {
                const targetQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI / 2);
                pillRef.current.quaternion.slerp(targetQuat, 0.1);

                const angleDiff = pillRef.current.quaternion.angleTo(targetQuat);
                if (angleDiff < 0.01) {
                    pillRef.current.quaternion.copy(targetQuat);
                    verticalSeparateStage = 1;
                }

            } else if (verticalSeparateStage === 1) {
                const targetOffset = 0.2;
                const currentOffset = top.position.x - bottom.position.x;
                const remaining = (targetOffset - currentOffset) / 2;

                top.position.x -= remaining * easeFactor;
                bottom.position.x += remaining * easeFactor;

                if (Math.abs(remaining) < 0.01) {
                    verticalSeparateStage = 2;
                }
            } else if (verticalSeparateStage === 2) {
                const maxSeparation = 5;
                const currentDistance = Math.abs(top.position.x - bottom.position.x);
                const remaining = (maxSeparation - currentDistance) / 2;

                top.position.x -= remaining * easeFactor;
                bottom.position.x += remaining * easeFactor;

                if (currentDistance >= maxSeparation - 0.01) {
                    verticalSeparateStage = 3;
                }
            }
        }


        function updateNormals(n1, n2, doRotate, hori = 1, verti = 0) {
            const speed = 1;
            const topnormal = new THREE.Vector3(0.001 * verti, -0.001 * hori, 0);
            topnormal.applyQuaternion(n1.quaternion);

            const botnormal = new THREE.Vector3(-0.001 * verti, 0.001 * hori, 0);
            botnormal.applyQuaternion(n2.quaternion);

            pillRef.current.updateMatrixWorld(true);

            if (doRotate) {
                pillRef.current.rotation.y += 0.01 * speed
                pillRef.current.rotation.z += 0.01 * speed
            }

            const topMesh = pillRef.current.children[0];
            const topPlane = topMesh.material.clippingPlanes[0];
            topPlane.normal.copy(topnormal)
            topPlane.constant = 0

            const bottomMesh = pillRef.current.children[1];
            const bottomPlane = bottomMesh.material.clippingPlanes[0];
            bottomPlane.normal.copy(botnormal)
            bottomPlane.constant = 0
        }

        let isResetting = false;

        function resetRotation(n, endQuat = new THREE.Quaternion(), duration = 1) {
            if (!n) return;

            const startTime = performance.now();

            isResetting = true;

            function animateReset(time) {
                const elapsed = (time - startTime) / 1000;
                const t = Math.min(elapsed / duration, 1);

                n.quaternion.slerp(endQuat, t);
                n.quaternion.normalize();

                if (t < 1) {
                    requestAnimationFrame(animateReset);
                } else {
                    isResetting = false;
                }
            }

            requestAnimationFrame(animateReset);
        }

        function onMouseDown(e) {
            // console.log("asdasd")
            // if (!pillRef.current) return
            // stateRef.current = "seperate"
        }

        // function onMouseUp() {
        //     if (!pill) return
        //     drag = false
        // }

        // function onMouseMove(e) {
        //     if (!drag || !planet) return
        //     const dX = e.clientX - lastX
        //     const dY = e.clientY - lastY

        //     lastX = e.clientX
        //     lastY = e.clientY

        //     const qX = new THREE.Quaternion()
        //     const qY = new THREE.Quaternion()

        //     const cameraRight = new THREE.Vector3();
        //     camera.getWorldDirection(cameraRight);
        //     cameraRight.cross(camera.up).normalize();
        //     qX.setFromAxisAngle(cameraRight, dY * rotationSpeed);

        //     qY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), dX * rotationSpeed)

        //     planet.quaternion.multiplyQuaternions(qX, planet.quaternion)
        //     planet.quaternion.multiplyQuaternions(qY, planet.quaternion)
        // }

        const resize = (width, height) => {
            renderer.setSize(width, height);
            composer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            outlinePass.setSize(width, height);
        }

        return () => {
            if (observer) observer.disconnect();
            composer?.dispose();
            outlinePass?.dispose();
            if (renderer?.domElement) renderer.domElement.removeEventListener("pointerdown", onMouseDown)
            window.removeEventListener("pointermove", onMouseMove);
            window.removeEventListener("pointerup", onMouseUp);
            cancelAnimationFrame(animationId);
            if (renderer && containerRef.current) {
                renderer.dispose();
                containerRef.current.removeChild(renderer.domElement);
            }
            scene?.clear();

        };
    }, [])

    return (
        <div
            ref={containerRef}
            className="w-full h-full"
        />
    );

})