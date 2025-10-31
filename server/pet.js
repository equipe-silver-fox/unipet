
document.addEventListener("DOMContentLoaded", () => {
  const btnAddPet = document.getElementById('btnAddPetProfile');
  const modal = document.getElementById('modalAddPetProfile');
  const btnCancel = document.getElementById('btnCancelPetProfile');
  const form = document.getElementById('formAddPetProfile');
  const petImageInput = document.getElementById('petImage');
  const imagePreview = document.getElementById('imagePreview');

  const API_URL = "http://localhost:3000";

  // Abrir modal
  btnAddPet.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  // Fechar modal
  const fecharModal = () => {
    modal.classList.add('hidden');
    form.reset();
    imagePreview.innerHTML = '';
  };

  btnCancel.addEventListener('click', fecharModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) fecharModal();
  });

  // Preview da imagem
  petImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.innerHTML = '';
    }
  });

  // Submissão do formulário
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
      nome: document.getElementById('petTag').value,            // Nome do pet
      tipo: document.getElementById('petRaca')?.value || "",  // Tipo/raça
      idade: parseInt(document.getElementById('petIdade')?.value) || 0,
      imagem: imagePreview.querySelector('img')?.src || '',   // Imagem em base64
    };

    try {
      const res = await fetch(`${API_URL}/pets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Erro ao adicionar pet");
      const novoPet = await res.json();
      alert('Pet adicionado com sucesso!');
      
      // Atualizar lista de pets
      if (typeof carregarPets === 'function') carregarPets();

      fecharModal();
    } catch (err) {
      console.error(err);
      alert("Erro ao adicionar pet");
    }
  });
});
