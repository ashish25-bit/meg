import React, { useRef, useState } from 'react';

const Sample = () => {

	const [lines, setLines] = useState(1);
	const [currentLine, setCurrentLine] = useState(1);
	const ele = useRef<HTMLDivElement>(null);
	const currentLineRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);

	function captureKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			e.preventDefault();
			setLines(prevState => prevState + 1);
			setCurrentLine(prevState => prevState + 1);
		}

		if (currentLineRef.current && inputRef.current) {
			currentLineRef.current.innerText = inputRef.current?.value;
			console.log(currentLineRef.current.clientWidth)
			inputRef.current.style.width = `${currentLineRef.current.clientWidth + 4}px`;
		}
	}

  return (
    <div style={{...main, position: "relative"}}>
			<div style={{...gutter, position: 'absolute', textAlign: "center"}}>
				{
					new Array(lines).fill(0).map((_, index) => { return (<div ref={ele} className='dead-center' style={number} key={index}>{index+1}</div>) })
				}
			</div>
			<div style={{...editor, position: 'absolute'}}>
				<input
					ref={inputRef}
					onKeyDown={e => captureKeyDown(e)} 
					style={{...input, position: 'relative', zIndex: 10, top: `${(lines-1)*26}px`}}
				/>
				{
					new Array(lines).fill(0).map((_, index) => { return (
						index + 1 === currentLine ? 
							<div ref={currentLineRef} key={index} style={{ opacity: 0, background: 'red', height:'26px', minWidth: 'calc(95% - 20px)' }}></div> : 
							<div style={{ height:'26px', width: '100%' }} key={index}>{currentLine} - {index+1}</div>
					)})
				}
			</div>
    </div>
  )
}

const main = {
	width: "90%",
	margin: "40px auto",
	height: "80vh",
	background: "#22272E",
	overflow: 'auto'
};

const gutter = {
	minWidth: '5%',
	height: "100%",
	background: "rgba(0, 0, 0, 0.25)",
	top: "0",
	left: '0',
	color: '#fff'
};

const editor = {
	minWidth: "95%",
	height: "100%",
	background: "#22272E",
	top: "0",
	right: '0',
};

const input = {
	height: '26px',
	background: "#ffffff38",
	left: '5%',
	minWidth: 'calc(95% - 20px)',
	color: '#fff',
	padding: '0 10px'
}

const number = { 
	height: '26px', 
	fontSize: '10px'
}

export default Sample;
