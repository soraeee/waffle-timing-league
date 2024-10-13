/// <reference types="vite-plugin-svgr/client" />
import Info from '../assets/info.svg?react';
import Close from '../assets/close.svg?react';

import useStore from '../stores';

function WarningModal() {
	const warning = useStore((state) => state.warning);
	const setWarning = useStore((state) => state.setWarning);

	let infoClass: string = warning.type === 0 ? "warningmodal-info-0" : "warningmodal-info-1"
	infoClass += " warningmodal-icon"

	return (<>
		<div className="warningmodal">
			<div>
				<Info className={infoClass} />
			</div>
			<p className = "warningmodal-text">{warning.message}</p>
			<div>
				<Close onClick={() => setWarning({enabled: false, message: "", type: 0})} className = "warningmodal-close warningmodal-icon"/>
			</div>
		</div>
	</>)
}

export default WarningModal;