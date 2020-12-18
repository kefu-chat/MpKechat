export default (onComplete) => {
	if (!uni.canIUse('requestSubscribeMessage') || !uni.requestSubscribeMessage) {
		return onComplete();
	}
	uni.requestSubscribeMessage({
		tmplIds:[
			'LHgTmtQNNOiAZ8qNL9g4y3RFTOmlMUeaPNkfs5Trte8',
			'LHgTmtQNNOiAZ8qNL9g4y-7a_gzNX62chkju-eX44jc',
			'OmFBieiBSjQGgODZCmE71w1VnptOc_sMYysdaAtURGg',
		],
		success: console.log,
		fail: console.log,
		complete: onComplete,
	});
}