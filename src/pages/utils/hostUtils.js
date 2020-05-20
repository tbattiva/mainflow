import backend from '../../services/backend';

async function handleHostDeletion(hostId, obj){
    try {
        await backend.delete(`/hosts/${hostId}`);
        alert("Host Deleted");
        obj.parentElement.closest(".host-item").remove();
        return;
    } catch (error) {
        alert("Something went wrong!");
        console.log(error);
    }

}

export{
    handleHostDeletion
}