var version = 8;

this.oninstall = function(ev) {
    self.skipWaiting();    
};

this.onactivate = function(ev) {
    console.log("Service worker is activated.");
    
};

var reg = this.registration;

this.onpush = function(pe) {
    registration.showNotification("A birthday is coming up!")
    .then(function(notificationEvent) {
        if (clients.openWindow) {
            clients.openWindow(reg.scope);
          }
    })
    .catch(function(error) {
        console.log("error:", error);
    })
}


this.onfetch = function(fe) {
    var url = fe.request.url;

    console.log("reg.scope", reg.scope);
    console.log("url", url);
    if (url.startsWith(reg.scope) && url.endsWith("sw/subscribe")) {
        fe.respondWith(
            reg.pushManager.subscribe()
            .then(pushSubscription => {
                return fetch("api/subscriptions", { 
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    
                    body: JSON.stringify({
                        id: 0,
                        url: pushSubscription.endpoint
                    })
                })
            })
            .then(response => { 
                return response
            })
        );
    } else if (url.startsWith(reg.scope) && url.endsWith("sw/unsubscribe")) {
        reg.pushManager.getSubscription()
        .then( subs => { 
            subs.unsubscribe().then( result => { 
                fe.respondWith(new Response("ok"));
            });
        });
    }

    
}