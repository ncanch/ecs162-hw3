<script lang="ts">
  import { onMount } from "svelte";
  import Date from "./Date.svelte";
  import logo from "./assets/NewYorkTimes.svg.png";
  import Login from "./Login.svelte";

  interface Article {
    headline: { main: string };
    abstract: string;
    multimedia: {
      default: {
        url: string;
      };
    };
  }

  let articles: ArticalResponse | null = null;
  let topArticles: Article[] = [];
  let loading = true;
  let error = "";

  interface ArticalResponse {
    response: {
      docs: Article[];
    };
  }

  onMount(async () => {
    try {
      const response = await fetch("http://localhost:8000/getArticles");
      console.log(response.json);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      articles = await response.json();
      console.log("Articles:", articles);

      if (articles?.response?.docs) {
        for (let i = 0; i < 6; i++) {
          topArticles.push(articles?.response.docs[i]);
          console.log(topArticles);
        }
      }

      loading = false;
    } catch (error) {
      console.error("Failed to fetch articles:", error);
      error = error instanceof Error ? error.message : "Unknown error occurred";
      loading = false;
    }
  });
</script>

<header>
  <nav>
    <div class="date-container">
      <Date />
    </div>
    <div class="logo-container">
      <a href="https://www.nytimes.com/">
        <img src={logo} alt="NYTLogo" />
      </a>
    </div>
    <div class="login-container">
      <Login />
    </div>
  </nav>
</header>

<main>
  {#if loading}
    <p>Loading articles...</p>
  {:else if error}
    <p>Error: {error}</p>
  {:else if topArticles.length > 0}
    <div class="grid-container" data-testid="grid-container">
      <div class="article1">
        {#if topArticles[0]?.multimedia.default.url}
          <img src={topArticles[0]?.multimedia.default.url} alt="article1" />
        {/if}

        <h2>
          {topArticles[0]?.headline?.main || "Loading..."}
        </h2>
        <div class="read-text">6 min read</div>
        <div>
          <p>
            {topArticles[0]?.abstract || "No abstract available"}
          </p>
        </div>
      </div>

      <div class="article2">
        <div class="line"></div>
        {#if topArticles[1]?.multimedia.default.url}
          <img src={topArticles[1]?.multimedia.default.url} alt="article1" />
        {/if}

        <h1>{topArticles[1]?.headline?.main}</h1>
        <div class="read-text">5 min read</div>

        <div>
          <p>
            {topArticles[1]?.abstract}
          </p>
        </div>
      </div>

      <div class="article3">
        <div class="line"></div>
        {#if topArticles[2]?.multimedia.default.url}
          <img src={topArticles[2]?.multimedia.default.url} alt="article1" />
        {/if}

        <p class="articleTitle">
          {topArticles[2]?.headline?.main}
        </p>
        <div class="read-text">10 min read</div>

        <div>
          <p>
            {topArticles[2]?.abstract}
          </p>
        </div>
      </div>
      <div class="article4">
        <div class="line"></div>
        {#if topArticles[3]?.multimedia.default.url}
          <img src={topArticles[3]?.multimedia.default.url} alt="article1" />
        {/if}

        <p class="articleTitle">
          {topArticles[3]?.headline?.main}
        </p>
        <div class="read-text">8 min read</div>
        <div>
          <p>
            {topArticles[3]?.abstract}
          </p>
        </div>
      </div>
      <div class="article5">
        <div class="line"></div>
        {#if topArticles[4]?.multimedia.default.url}
          <img src={topArticles[4]?.multimedia.default.url} alt="article1" />
        {/if}

        <h3>{topArticles[4]?.headline?.main}</h3>
        <div class="read-text">4 min read</div>
        <div>
          <p>
            {topArticles[4]?.abstract}
          </p>
        </div>
      </div>
      <div class="article6">
        <div class="line"></div>

        {#if topArticles[5]?.multimedia.default.url}
          <img src={topArticles[5]?.multimedia.default.url} alt="article1" />
        {/if}

        <h2>{topArticles[5]?.headline?.main}</h2>
        <div class="read-text">2 min read</div>
        <div>
          <p>
            {topArticles[5]?.abstract}
          </p>
        </div>
      </div>
    </div>
  {:else}
    <p>No articles available</p>
  {/if}
</main>