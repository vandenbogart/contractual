<script lang="ts">
	import { invalidate } from "$app/navigation";
    import "../app.css";
	import { onMount } from 'svelte';

	export let data;

	let { supabase, session } = data;
	$: ({ supabase, session } = data);

	onMount(() => {
		const maxAge = 100 * 365 * 24 * 60 * 60; // 100 years, never expires
		const {
			data: { subscription }
		} = supabase.auth.onAuthStateChange((_event, _session) => {
            document.cookie = `access-token=${_session?.access_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
            document.cookie = `refresh-token=${_session?.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax; secure`;
            if (_session?.expires_at !== session?.expires_at) {
                invalidate('supabase:auth');
            }
		});
		return () => subscription.unsubscribe();
	});
</script>

<slot />
