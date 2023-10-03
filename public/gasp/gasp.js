/*gsap.set(".t-lines, .b-lines, .square, .cursor, .shapes, .text", {
	opacity: 1
});*/
/*gsap.to('.inner-div', {duration: 2, rotation:0, width: 600,height:400, });
function cursor() {
	const tl = gsap.timeline();

	tl
		.to(".cursor", {
			duration: 1,
			ease: "sine.out",
			motionPath: {
				path: "#path",
				align: "#path",
				end: 0.272,
				alignOrigin: [0.4, 0.4]
			}
		})
		.to(".click", {
			opacity: 1,
			duration: 0.05
		})
		.to(
			".click",
			{
				opacity: 0,
				duration: 0.05
			},
			"+=0.15"
		)
		.to(
			".cursor",
			{
				duration: 0.5,
				ease: "sine.out",
				motionPath: {
					path: "#path",
					align: "#path",
					start: 0.272,
					end: 0.42,
					alignOrigin: [0.4, 0.4]
				}
			},
			"+=0.3"
		)
		.to(".cursor", {
			duration: 1.4,
			ease: "sine.out",
			motionPath: {
				path: "#path",
				align: "#path",
				start: 0.42,
				end: 0.715,
				alignOrigin: [0.4, 0.4]
			}
		})
		.to(
			".boxes",
			{
				opacity: 1,
				duration: 0.01
			},
			"<"
		)
		.to(".cursor", {
			duration: 1,
			ease: "sine.out",
			motionPath: {
				path: "#path",
				align: "#path",
				start: 0.715,
				end: 1,
				alignOrigin: [0.4, 0.4]
			}
		});

	return tl;
}

function viewbox() {
	const tl = gsap.timeline({ defaults: { duration: 1.4, ease: "sine.out" } });

	tl
		.from(
			".b-r-box",
			{
				x: -101,
				y: -101
			},
			0
		)
		.from(
			".t-r-box",
			{
				x: -101
			},
			0
		)
		.from(
			".b-l-box",
			{
				y: -101
			},
			0
		);
	tl
		.from(
			".line-mask-t",
			{
				transformOrigin: "0% 0%",
				scale: 0
			},
			0
		)
		.from(
			".line-mask-b",
			{
				transformOrigin: "100% 100%",
				scale: 0
			},
			0
		)
		.from(
			".bottom-square",
			{
				transformOrigin: "0% 0%",
				x: -101,
				y: -101
			},
			0
		);

	return tl;
}

function lettering() {
	const leftLetters = [
		".v1",
		".i2",
		".w1",
		".w3",
		".b1",
		".o1",
		".x1",
		".x3",
		".i1"
	];

	const rightLetters = [".v2", ".e2", ".w4", ".b2", ".b3", ".o2", ".x2"];

	const tl = gsap.timeline({ defaults: { duration: 2, ease: "expo.out" } });

	leftLetters.forEach((letter) => {
		tl.from(
			letter,
			{
				xPercent: -100,
				stagger: {
					amount: 0.2
				}
			},
			0
		);
	});

	rightLetters.forEach((letter) => {
		tl.from(
			letter,
			{
				xPercent: 100,
				stagger: {
					amount: 0.2
				}
			},
			0
		);
	});
	tl.from(
		".w2",
		{
			opacity: 0
		},
		0
	);
	tl.from(
		".e1",
		{
			xPercent: -100,
			yPercent: 40,
			stagger: {
				amount: 0.2
			}
		},
		0
	);

	return tl;
}
*/
//const tl = gsap.timeline({ delay: 1, timeScale: 1.3 });
//console.log("got timeline")
function draw(){
gsap.set(".left-panel", { transformStyle: "preserve-3d",zIndex:5 });
gsap.set(".right-panel", { transformStyle: "preserve-3d",background:"#FFD700" });
gsap.set('.back', { rotationY: -180 })
gsap.set('.inner-div', { rotationX: 80,rotation:-5,translateX:-200,translateY:120,width:120,height:80 });
gsap.set('.left-panel', { rotationY: -5 })
gsap.set('.gsap-headline',{opacity:0})
gsap.set('.gsap-signature',{opacity:0})
gsap.set('.gsap-body',{opacity:0})
gsap.set('.gsap-footer',{opacity:0})
//gsap.to('.inner-div', { delay:1,duration: 1, left:-30,rotation: -10, width: 300, height: 200, ease: Sine.easeOut });
gsap.to('.inner-div', { delay:1,duration: 2, left:0,rotation: 0, width: 600, height: 400,translateX:0,translateY:80, ease: Back.easeOut });
gsap.to('.inner-div', { duration: 1, rotationX: 0, ease: Sine.easeOut,delay:1 })
gsap.to(`.left-panel`, { delay: 2.0, duration: 2, rotationY: -180, ease: Back.easeOut })
gsap.to(`.right-panel`, { delay: 2.4, duration: 2,background:"white", ease: Sine.easeOut })
//gsap.to('.body', { delay:1,duration: 3, rotationX: 0, ease: Sine.easeOut })
gsap.to('.gsap-headline',{delay:3,duration:1.0,opacity:1, ease: Sine.easeOut})
gsap.to('.gsap-signature',{delay:3,duration:2.0,opacity:1, ease: Sine.easeOut})

gsap.to('.gsap-body', {  delay: 3,duration: 2.0,opacity:1, ease: Sine.easeOut })
gsap.to('.gsap-footer', {  delay: 5,duration: 4.0,opacity:1, ease: Sine.easeOut })

/*
tl.set(".left-panel", { transformStyle: "preserve-3d" });
tl.set(".right-panel", { transformStyle: "preserve-3d" });
tl.set('.back', { rotationY: -180 })
tl.to('.inner-div', { duration: 2, rotation: 0, width: 600, height: 400, ease: Sine.easeOut });
tl.to('.inner-div', { duration: 3, rotationX: 0, ease: Sine.easeOut })
tl.to(`.left-panel`, { delay: 1.3, duration: 2, rotationY: 180, ease: Back.easeOut })
tl.to('.body', { duration: 3, rotationX: 0, ease: Sine.easeOut })
tl.to('.gsap-card', { duration: 2, opacity: 1, delay: 1.5 })
*/
/*

tl.to('.inner-div', { duration: 2, rotation: 0, width: 900, height: 600, });

tl.to('.inner-div', { duration: 2, rotation: 0, width: 600, height: 400, ease: Sine.easeOut });
tl.to(`.left-panel`, { delay: 1.3, duration: 2, rotationY: 180, ease: Back.easeOut })
tl.to('.body', { duration: 3, rotationX: 0, ease: Sine.easeOut })
tl.to('.gsap-card', { duration: 2, opacity: 1, delay: 1.5 })*/
gsap.set([".back", ".front"], { backfaceVisibility: "hidden" });
console.log("after to")
/*tl.from(
	".square",
	{
		scale: 0,
		transformOrigin: "50% 50%",
		duration: 1,
		ease: "elastic.out(0.58, 0.25)"
	},
	1.3
);
tl.add(cursor(), 0);
tl.add(viewbox(), 2.05);
tl.add(lettering(), 3.5);
tl.fromTo(
	".text",
	{
		opacity: 0,
		scale: 0.7,
		transformOrigin: "50% 50%"
	},
	{
		duration: 2,
		scale: 0.7,
		opacity: 1
	},
	"-=1.2"
);
*/
// ScrubGSAPTimeline(tl);
}
draw();
document.querySelector(".button").addEventListener("click", (e) => {
	draw();
});

/*



gsap-video-export https://codepen.io/cassie-codes/pen/VweQjBw -S svg -z 2 -v 1080x1080
   75  ffmpeg -i video.mp4 -vf "fps=30,scale=1080:1080:flags=lanczos,palettegen" palette.png
   76  ffmpeg -i video.mp4 -i palette.png -filter_complex "fps=30,scale=1080:1080:flags=lanczos[x];[x][1:v]paletteuse" video.gif

   */