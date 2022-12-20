// Copyright (c) 2016-2018 LG Electronics, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// SPDX-License-Identifier: Apache-2.0

import {isArray} from '../../utils/isNumeric';
import $L from '@enact/i18n/$L';

const parseNetworkInfo = (inNetworkInfo) => {
	const network = {
		displayName: inNetworkInfo.displayName,
		ssid: inNetworkInfo.ssid,
		bssInfo: inNetworkInfo.bssInfo || {},
		strength: inNetworkInfo.signalBars,
		status: 'NOT_CONNECTED',
		secure: false,
		securityType: 'none'
	};
	if (toString.call(inNetworkInfo.connectState) === '[object String]') {
		if (inNetworkInfo.connectState === 'ipConfigured') {
			network.status = 'CONNECTED';
		} else if (inNetworkInfo.connectState === 'associating' || inNetworkInfo.connectState === 'associated') {
			network.status = 'CONNECTING';
		}
	}
	if (isArray(inNetworkInfo.availableSecurityTypes) && inNetworkInfo.availableSecurityTypes.length > 0 && inNetworkInfo.availableSecurityTypes[0] !== 'none') {
		network.secure = true;
		network.securityType = inNetworkInfo.availableSecurityTypes[0];
	}

	if (inNetworkInfo.profileId) {
		network.profileId = inNetworkInfo.profileId;
	}

	return network;
};

export function makeNetworkListArray (wifiNetworks) {
	const newNetworkList = [];
	if (wifiNetworks) {
		let network = {};
		let connectingConnectedNetwork = null;
		for (let net of wifiNetworks.foundNetworks) {
			let netInfo = net.networkInfo;
			if (!netInfo.supported) {
				continue;
			}
			network = parseNetworkInfo(netInfo);
			if (connectingConnectedNetwork === null && network.status !== 'NOT_CONNECTED') {
				connectingConnectedNetwork = network;
			} else {
				if (typeof network.profileId !== 'undefined') {		// eslint-disable-line
					newNetworkList.unshift(network);
				} else {
					newNetworkList.push(network);
				}
			}
		}
		if (connectingConnectedNetwork !== null) {
			newNetworkList.unshift(connectingConnectedNetwork);
		}
	}
	return newNetworkList;
}

const NetworkError = {
	UNKNOWN_ERROR: 1,
	WIFI_TECHNOLOGY_UNAVAILABLE:5,
	PASSWORD_ERROR: 10,
	AUTHENTICATION_FAILURE:11,
	LOGIN_FAILURE:12,
	CONNECTION_ESTABLISHMENT_FAILURE:13,
	INVALID_IP_ADDRESS:14,
	PINCODE_ERROR:15,
	OUT_OF_RAGE:16,
	NETWORK_NOT_FOUND:102
};

export function findMsgByErrorCode (errorCode) {
	let msg = '';
	let errorMsg = [];
	switch (errorCode) {
		case NetworkError.UNKNOWN_ERROR:
			msg = $L('Could not indentify the reason for failure.'); // i18n : New exception message of unknown error
			break;
		case NetworkError.PASSWORD_ERROR:
			msg = $L('Reason: Entered password is incorrect.'); // i18n : New exception message when the supplied password is incorrect
			break;
		case NetworkError.AUTHENTICATION_FAILURE:
			msg = $L('Reason: Authentication with access point failed.'); // i18n : New exception message of authentication failure
			break;
		case NetworkError.LOGIN_FAILURE:
			msg = $L('Reason: Unable to login.'); // i18n : New exception message of login failure
			break;
		case NetworkError.CONNECTION_ESTABLISHMENT_FAILURE:
			msg = $L('Reason: Could not establish a connection to access point.'); // i18n : New exception message of no internet connection
			break;
		case NetworkError.INVALID_IP_ADDRESS:
			msg = $L('Reason: Could not retrieve a valid IP address by using DHCP.'); // i18n : DHCP means dynamic host configuration protocol
			break;
		case NetworkError.PINCODE_ERROR:
			msg = $L('Reason: PIN is missing.'); // i18n : New exception message of wrong PIN code
			break;
		case NetworkError.OUT_OF_RAGE:
			msg = $L('Reason: The network you selected is out of range.'); // i18n : New exception message of network out of range
			break;
		case NetworkError.NETWORK_NOT_FOUND: // Error message: 'Network not found'
			msg = $L('Could not fined available network.'); // i18n : New exception message of network out of range
			break;
		case NetworkError.WIFI_TECHNOLOGY_UNAVAILABLE: // 'WiFi technology unavailable'
			msg = $L('Wi-Fi error occurred.'); // i18n : New exception message of network out of range
			break;
		default:
			msg = $L('Please check the network name and password and try again.');
			break;
	}
	errorMsg.push($L('Unable to connect to the network.'), msg, ($L('Please check the status and try again')));
	return errorMsg;
}
