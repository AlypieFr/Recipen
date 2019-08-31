session = {};

session.get = function(url, then, error_message=null, except=null, final=null) {
    eventBus.$emit("startLoading");
    ax = axios.get(url);
    ax.then(function(response) {
        then(response);
    });
    if (except !== null) {
        ax.catch(except);
    }
    else {
        ax.catch(function(error) {
            console.error("ERROR", error);
            eventBus.$emit("notifError",
                error_message !== null ? error_message : tr("Request fails. Please contact the support."))
        })
    }
    ax.finally(function() {
        eventBus.$emit("stopLoading");
        if (final !== null) {
            final();
        }
    })
};

session.post = function(url, data, then, error_message=null, except=null, final=null) {
    eventBus.$emit("startLoading");
    ax = axios({
        method: 'post',
        url: url,
        data: data,
        json: true,
        headers: {
            'Content-Type': 'application/json'
        }
    });
    ax.then(function(response) {
        then(response);
    });
    if (except !== null) {
        ax.catch(except);
    }
    else {
        ax.catch(function(error, data) {
            console.error("ERROR", error.response);
            if (error.response !== undefined && error.response.data !== undefined
                    && typeof error.response.data === "object" && error.response.data.message !== undefined) {
                error_message = error.response.data.message
            }
            error_message = error_message !== null ? error_message : tr("Request fails. Please contact the support.");
            eventBus.$emit("notifError", error_message)
        })
    }
    ax.finally(function() {
        eventBus.$emit("stopLoading");
        if (final !== null) {
            final();
        }
    })
};