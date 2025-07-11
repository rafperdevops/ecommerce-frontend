const URL_API = "http://52.228.78.72:8080";
function save() {
    const form = document.getElementById("formProduct");
    const formData = new FormData(form);

    fetch(`${URL_API}/products`, {
        method: "post",
        body: formData
    })
        .then(resp => resp.json())
        .then(data => {
            //{status: "ok", msg: "Guardado", data:[]}
            if (data.status == "ok") {
                clear();
            }
            alert(data.msg);
        })
}

function get() {
    const id = document.querySelector("#txtId").value;
    fetch(`${URL_API}/products/${id}`)
        .then(resp => resp.json())
        .then(data => {
            //{status: "ok", msg: "Guardado", data:[]}
            if (data.status == "ok") {
                const product = data.data;
                document.getElementById("txtId").value = product.id;
                document.getElementById("txtNombre").value = product.name;
                document.getElementById("txtStock").value = product.stock;
                document.getElementById("txtPrecio").value = product.price;
            } else {
                alert(data.msg);
                clear();
            }
        })

}

function clear() {
    document.getElementById("txtId").value = "";
    document.getElementById("txtNombre").value = "";
    document.getElementById("txtStock").value = "";
    document.getElementById("txtPrecio").value = "";
}

function eliminar() {
    const resp = confirm("Realmente desea ELIMINAR el producto");
    if (resp) {
        const id = document.querySelector("#txtId").value;
        fetch(`${URL_API}/products/${id}`, {
            method: "delete",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => resp.json())
            .then(data => {
                //{status: "ok", msg: "Guardado", data:[]}
                if (data.status == "ok") {
                    clear();
                }
                alert(data.msg);
            })
    }
}

function update() {
    let prod = {}; //JSON 
    const id = document.querySelector("#txtId").value;

    prod.id = document.getElementById("txtId").value
    prod.name = document.getElementById("txtNombre").value
    prod.stock = document.getElementById("txtStock").value
    prod.price = document.getElementById("txtPrecio").value

    fetch(`${URL_API}/products/${id}`, {
        method: "put",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(prod)
    })
        .then(resp => resp.json())
        .then(data => {
            //{status: "ok", msg: "Guardado", data:[]}
            if (data.status == "ok") {
                clear();
            }
            alert(data.msg);
        })
}

function listar() {
    fetch(`${URL_API}/products`)
        .then(resp => resp.json())
        .then(data => console.log(data))
}

function cargarProductos() {
    // var tbody = document.getElementById("productList");

    fetch(`${URL_API}/products`)
        .then(res => res.json())
        .then(data => {
            tbody = document.getElementById("productList");
            data.forEach(prod => {
                const row = document.createElement("tr");
                row.innerHTML = `
                                        <td>${prod.id}</td>
                                        <td>${prod.name}</td>
                                        <td>${prod.price}</td>
                                        <td>${prod.stock}</td>
                                        <td><img src="${URL_API}/${prod.image_url}" width="100px"></td>
                                        <td><input type="checkbox" data-id="${prod.id}"></td>
                                        <td><input type="number" min="1" value="1" data-qty="${prod.id}"></td>
                                        `;
                tbody.appendChild(row);
            });

        })
}

function realizarPedido() {
    const checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
    const items = [];

    checkboxes.forEach(chk => {
        const id = chk.getAttribute("data-id");
        const qty = document.querySelector(`input[data-qty="${id}"]`).value;
        items.push({ product_id: id, quantity: qty })
    })

    if (items.length == 0)
        return alert("Seleccione los productos")

    fetch(`${URL_API}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items })
    })
        .then(res => res.json())
        .then(data => {
            alert(data.msg);
        })

}
document.addEventListener("load", cargarProductos());