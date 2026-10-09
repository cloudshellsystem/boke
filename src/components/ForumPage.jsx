// Exemple de correction pour libérer le chargement si la requête échoue :
useEffect(() => {
  async function fetchPosts() {
    try {
      const { data, error } = await supabase.from('forum_posts').select('*');
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      console.warn("Erreur chargement forum, utilisation des posts locaux :", err.message);
      setPosts([
        { id: 1, title: "Bienvenue sur le forum Boké One", content: "Échangez ici entre créateurs et professionnels !" }
      ]);
    } finally {
      setLoading(false); // 🔑 TRÈS IMPORTANT : libère l'affichage dans tous les cas
    }
  }
  fetchPosts();
}, []);