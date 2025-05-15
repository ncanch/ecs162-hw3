<script type="ts">
    function dropdownMenu() {
        let content = document.getElementById("dropdown-content")
        let account = document.getElementById("dropbtn")
        if(content.style.visibility == "hidden") {
            content.style.visibility = "visible"
            account.innerHTML = "<strong>Account</strong>  &#9652"
        } else {
            content.style.visibility = "hidden"
            account.innerHTML = "<strong>Account</strong>  &#9662"
        }
    }
</script>


<div class="top-right">
    <button on:click={dropdownMenu} class="btn" id="dropbtn"><strong>Account</strong>  &#9662</button>
    <div id="dropdown-content">
        <p>rando@email.com</p>
        <button class="btn" id="logout-button">Log Out</button>
    </div>
    
    <!--
    <button class="btn" id="login-button">LOG IN</button>
    -->
</div>

<style>
  .btn {
    font-size: 1rem;
    line-height: 2;
    font-family:"Helvetica Neue", Arial, Helvetica, sans-serif;
    border: none;
    background-color: white;
    color: black;
  }
  
  #login-button {
    color: white;
    background-color: #5c849c;
    font-size: 0.8rem;
  }

  #dropbtn {
    color: black;
  }

  #dropdown-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    visibility: hidden;
  }

  .top-right {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  #logout-button:hover {
    text-decoration: underline;
  }
</style>