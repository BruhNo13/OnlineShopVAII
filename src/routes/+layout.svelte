<script lang="ts">
    import { page } from '$app/stores';
    import Header from '../components/Header.svelte';
    import Footer from '../components/Footer.svelte';

    export let data: { user: string | null; role: string | null };

    let pageClass = '';
    $: {
        pageClass = $page.url.pathname === '/'
            ? 'homepage'
            : $page.url.pathname.includes('/filter')
                ? 'filter-page'
                : 'standard-page';
    }
</script>

<Header userDetails={{ user: data.user, role: data.role }} />
<main class={pageClass}>
    <slot />
</main>
<Footer />

<style>
    html, body {
        height: 100%;
        margin: 0;
        display: flex;
        flex-direction: column;
    }

    main {
        flex: 1;
        margin: 0 auto;
    }

    .homepage {
        max-width: 1200px;
        padding: 1rem;
    }

    .filter-page {
        max-width: 100%;
        padding: 2rem;
    }

    .standard-page {
        max-width: 100%;
        padding: 2rem;
    }
</style>
