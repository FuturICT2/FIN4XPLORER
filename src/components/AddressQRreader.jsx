import React, { useState, useEffect, useRef } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';
import { BrowserQRCodeReader } from '@zxing/library';

function AddressQRreader(props) {
	const { t } = useTranslation();

	const [isQRModalOpen, setIsQRModalOpen] = useState(false);
	const [iconIsHovered, setIconHovered] = useState(false);

	const codeReader = useRef(new BrowserQRCodeReader());
	const [scannedAddress, setScannedAddress] = useState(null);

	const toggleModal = () => {
		if (isQRModalOpen) {
			codeReader.current.stopStreams();
		}
		setIsQRModalOpen(!isQRModalOpen);
	};

	async function getAddressFromQRCode() {
		// via https://github.com/zxing-js/library
		codeReader.current
			.decodeFromInputVideoDevice(undefined, 'qr_vid')
			.then(result => {
				let addr = result.text;
				// apparently MetaMask prepends this to their generated QR codes
				if (addr.startsWith('ethereum:')) {
					addr = addr.substring(9, addr.length);
				}
				console.log('QR code read: ' + addr);
				setScannedAddress(addr);
				setIsQRModalOpen(false);
				codeReader.current.stopStreams();
			})
			.catch(err => {
				console.error(err);
				setIsQRModalOpen(false);
				codeReader.current.stopStreams();
			});
	}

	return (
		<>
			<TextField
				type="text"
				label="Public address"
				style={styles.inputField}
				variant="outlined"
				value={scannedAddress ? scannedAddress : ''}
				onChange={e => setScannedAddress(e.target.value)}
				InputProps={{
					style: { fontSize: 'small' },
					endAdornment: (
						<InputAdornment position="end">
							<FontAwesomeIcon
								style={iconIsHovered ? styles.QRiconHover : styles.QRicon}
								icon={faQrcode}
								onClick={() => {
									toggleModal();
									getAddressFromQRCode();
								}}
								onMouseEnter={() => setIconHovered(true)}
								onMouseLeave={() => setIconHovered(false)}
							/>
						</InputAdornment>
					)
				}}
			/>
			<Modal isOpen={isQRModalOpen} handleClose={toggleModal} title="Scan QR Code" width="324px">
				<center>
					<video id="qr_vid" width="300" height="200"></video>
				</center>
			</Modal>
		</>
	);
}

const styles = {
	QRicon: {
		color: 'black',
		width: '20px',
		height: '20px',
		padding: '3px 2px 3px 1px'
	},
	QRiconHover: {
		color: 'gray',
		width: '23px',
		height: '23px'
	},
	inputField: {
		width: '100%',
		marginBottom: '15px'
	},
	smallFont: {
		fontSize: 'small'
	}
};

const mapStateToProps = state => {
	return {};
};

export default drizzleConnect(AddressQRreader, mapStateToProps);