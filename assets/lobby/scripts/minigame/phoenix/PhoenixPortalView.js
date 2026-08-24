
var netConfig = require('NetConfig');
(function () {
    cc.PhoenixPortalView = cc.Class({
        "extends": cc.Component,

		properties: {
			lbJackpot: cc.LabelIncrement
		},

        onLoad: function () {
            this.hubName = cc.HubName.PhoenixHub;
            this.subDomainName = cc.SubdomainName.PHOENIX;
			this.connectHub();
        },

        onDestroy: function () {
            this.unscheduleAllCallbacks();
        },
		
        connectHub: function () {
            var negotiateCommand = new cc.NegotiateCommand;
            negotiateCommand.execute(this, this.subDomainName);
        },

        onSlotsNegotiateResponse: function (response) {
            this.connectionToken = response.ConnectionToken;
            this.AviatorHub = new cc.Hub;
            this.AviatorHub.connect(this, this.hubName, response.ConnectionToken);
        },

        onHubOpen: function () {
			return;
        },
		
        onHubMessage: function (response) {
            if (response.M !== undefined && response.M.length > 0) {
                let res = response.M;
                res.map(m => {
					let info = m.A[0];
					if (info.Jackpot != null) {
						this.lbJackpot.tweenValueto(info.Jackpot);
					} else {
						return;
					}
                });

            } else {
                //PING PONG
                if (response.I) {
                    this.AviatorHub.pingPongResponse(response.I);
                }
            }
        },
		
	});
}).call(this);