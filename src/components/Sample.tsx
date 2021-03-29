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
	}
	
	function inputText(e: React.FormEvent<HTMLInputElement>) {
		if (currentLineRef.current && inputRef.current) {
			inputRef.current.style.minWidth = `${currentLineRef.current.scrollWidth - 20}px`;
			currentLineRef.current.innerText = inputRef.current.value;
		}
	}

  return (
    <div style={{ ...main, overflowY: 'auto', overflowX: 'hidden' }}>
			<div style={{...gutter, textAlign: "center"}}>
			{
				new Array(lines).fill(0).map((_, index) => { return (
					<div ref={ele} className='dead-center' style={number} key={index}>{index+1}</div>) 
				})
			}
			</div>
			<div style={{...editor, position: 'relative', overflowX: 'auto'}}>
				<input
					ref={inputRef}
					onKeyDown={e => captureKeyDown(e)} 
					onInput={e => inputText(e)} 
					style={{...input, position: 'absolute', zIndex: 100000, top: `${(lines-1)*26}px`}}
				/>
				{
					new Array(lines).fill(0).map((_, index) => { return (
						index + 1 === currentLine ? 
							<div ref={currentLineRef} key={index} 
							className='dead-center'
							style={{
								padding: '0 10px',
								opacity: 0,
								// background: 'red',
								height:'26px', 
								minWidth: 'calc(100% - 20px)',
								fontSize: '15px',
							}}></div> : 
							<div style={{
								height:'26px', padding: '0 10px',
								minWidth: 'calc(100% - 20px)',
								fontSize: '15px'
							}} key={index} className="dead-center" ></div>
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
	display: 'grid',
	gridTemplateColumns: '5% 95%'
};

const gutter = {
	background: "rgba(0, 0, 0, 0.25)",
	top: "0",
	left: '0',
	color: '#fff'
};

const editor = {
	background: "#22272E",
	top: "0",
	color: '#fff',
	right: '0',
};

const input = {
	height: '26px',
	background: "#ffffff38",
	minWidth: 'calc(100% - 20px)',
	color: '#fff',
	padding: '0 10px',
	fontSize: '15px',
}

const number = { 
	height: '26px', 
	fontSize: '10px',
}

export default Sample;
