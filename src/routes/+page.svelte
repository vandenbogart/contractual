<script lang="ts">

    export let data;
    let { user } = data;
</script>

<div class="hero min-h-screen bg-base-100">
  <div class="hero-content text-center">
    <div class="max-w-xl">
      <h1 class="text-5xl font-bold">Hello there {user?.id}</h1>
      <p class="py-6">This tool can help you build a legal contract. Please provide a brief discription of the type of contract you would like to create.</p>
      <form method="POST">
          <input name="prompt" class="input input-bordered w-full text-center" type="text" placeholder="a contract for some work on a companies website" />
          <div class="h-5" /> 
          <button type="submit" class="btn btn-primary">Get Started</button>
      </form>
    </div>
  </div>
</div>
