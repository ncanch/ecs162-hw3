(function() {
    //make sure the page is loaded before we run any code
    window.addEventListener("load", init);
  
    //display the current date once the page has been loaded
    function init() {
        console.log("here")
        let drop = document.getElementById("dropbtn")
        drop?.addEventListener("click", dropdownFunction)

        function dropdownFunction() {
            console.log("hi")
            // document.getElementById("account-dropdown")?.classList.toggle("dropdown-content")
        }
    }
})();