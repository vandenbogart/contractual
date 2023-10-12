<script lang="ts">
	import { PUBLIC_SUPABASE_URL } from '$env/static/public';
	import { onMount } from 'svelte';
	export let data;


    let message = "";
	const stream = async () => {
		const res = await fetch(`${PUBLIC_SUPABASE_URL}/functions/v1/openai`, {
			headers: {
				Authorization: `Bearer ${data.session.access_token}`,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify({
				messages: data.messages
			})
		});
		const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
		await process(reader);
	};
	async function process(reader: ReadableStreamDefaultReader<string>): Promise<any> {
		const { done, value } = await reader.read();
		const messages = value
			?.split('\n\n')
			.map((v) => v?.slice(6, v.length))
			.filter((m) => m.length > 0 && m !== "[DONE]");
		const parsed = messages?.map((m) => JSON.parse(m));
		if (done || !parsed || parsed.at(-1)?.finished_reason === "stop" ) {
			console.log('Completed');
			return;
		}
        parsed.map(m => message = message.concat(m.choices[0]["delta"]["content"]));
		return await process(reader);
	}
</script>

<div class="flex justify-center my-10">
	<div class="flex-col w-3/4 gap-5">
		<div class="w-full">
			<button class="btn btn-primary" on:click={stream}>Test</button>
			{#each data.messages ?? [] as message}
				<div class="card w-full bg-base-300 shadow-xl">
					<div class="card-body">
						<p>{message.content}</p>
					</div>
				</div>
			{/each}
            <p>{message}</p>
		</div>
	</div>
</div>
