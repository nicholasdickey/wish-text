gsap.set(".t-lines, .b-lines, .square, .cursor, .shapes, .text", {
	opacity: 1
});

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

const tl = gsap.timeline({ delay: 1, timeScale: 1.3 });
tl.from(
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

// ScrubGSAPTimeline(tl);

document.querySelector(".button").addEventListener("click", (e) => {
	tl.restart();
});
