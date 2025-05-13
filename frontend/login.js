(function() {
    //make sure the page is loaded before we run any code
    window.addEventListener("load", init);
  
    function init() {
        document.getElementById("login-form").addEventListener("submit", function(e) {
            // Fires when submit event happens on form
            // If we've gotten in here, all HTML5 validation checks have passed
            e.preventDefault(); // prevent default behavior of submit (page refresh)
            submitRequest(); // intended response function
        });
    }

    function submitRequest() {
        let url = url_for('login')
        let params = new FormData(document.getElementById("login-form"))
        fetch(url, { method : "POST", body : params })
    }
})