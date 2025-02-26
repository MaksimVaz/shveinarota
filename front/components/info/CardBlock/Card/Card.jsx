import { motion } from "framer-motion";
import Image from "next/image";
import { forwardRef } from "react";

const Card = forwardRef(({ title, number, img }, ref) => {

	const blockAnitmation = {
		hidden: {
			y: 70,
			opacity: 0,
		},
		visible: custom => ({
			y: 0,
			opacity: 1,
			transition: { delay: custom * 0.2 },
		}),
	}

	return (
		<motion.div initial="hidden"
			whileInView="visible"
			viewport={{ amount: 0, once: true }}
			ref={ref}
			className="card"

			custom={1}
			variants={blockAnitmation}
		>
			<div className="card__top">
				<p className="card__number">{number}</p>
				<Image
					src={'http://drive.google.com/uc?export=view&id=' + img}
					height={35}
					width={35}
					alt="icon"
				/>
			</div>
			<div className="card__bottom">
				<h1 className="card__title">{title}</h1>
			</div>
		</motion.div>
	);
});

Card.displayName = 'Card';
export default Card;

export const MCard = motion(Card)