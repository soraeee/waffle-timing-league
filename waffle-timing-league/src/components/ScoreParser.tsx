import { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';

function ScoreParser(props: any) {
	let img: string = props.img;
	const [text, setText] = useState<string>('');

	useEffect(() => {
		const recognizeText = async () => {
		  if (img) {
			const result = await Tesseract.recognize(img);
			setText(result.data.text);
		  }
		};
		recognizeText();
	  }, [img]);
	  
	return (
		<>
			<div>{text}</div>
		</>
	)
}

export default ScoreParser;