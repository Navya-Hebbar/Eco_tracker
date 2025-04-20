document.addEventListener("DOMContentLoaded", () => {
    const materialDropdown = document.getElementById("material");
    const gradeDropdown = document.getElementById("grade");
    const unitDropdown = document.getElementById("unit");
    const quantityInput = document.getElementById("quantity");
    const addButton = document.getElementById("add-material");
    const materialsList = document.getElementById("material-items");
    const calculateButton = document.getElementById("calculate");
    const resultDiv = document.getElementById("result");
    const downloadButton = document.getElementById("download-pdf");

    let materials = [];

    const gradeOptions = {
        "Cement": ["OPC 33", "OPC 43", "OPC 53", "PPC", "PSC"],
        "Steel": ["Fe 415", "Fe 500", "Fe 550", "Fe 600"],
        "Sand": ["River Sand", "M-Sand"],
        "Bricks": ["Clay Bricks", "Fly Ash Bricks", "AAC Blocks"],
        "Concrete": ["M15", "M20", "M25", "M30"]
    };

    const unitOptions = {
        "Cement": "kg",
        "Steel": "kg",
        "Sand": "m³",
        "Bricks": "Numbers",
        "Concrete": "m³"
    };

    // ⬇️ Move emission factors here so accessible in download too
    const emissionFactors = {
        "Cement": 0.9,
        "Steel": 1.8,
        "Sand": 14.0,
        "Bricks": 0.2,
        "Concrete": 290.0
    };

    const unitConversions = {
        "Cement": 1,
        "Steel": 1,
        "Sand": 1,
        "Bricks": 1,
        "Concrete": 1
    };

    materialDropdown.addEventListener("change", () => {
        const selectedMaterial = materialDropdown.value;

        gradeDropdown.innerHTML = `<option value="" disabled selected>Select Grade</option>`;
        if (gradeOptions[selectedMaterial]) {
            gradeOptions[selectedMaterial].forEach(grade => {
                let option = document.createElement("option");
                option.value = grade;
                option.textContent = grade;
                gradeDropdown.appendChild(option);
            });
            gradeDropdown.disabled = false;
        } else {
            gradeDropdown.disabled = true;
        }

        unitDropdown.innerHTML = `<option value="${unitOptions[selectedMaterial]}" selected>${unitOptions[selectedMaterial]}</option>`;
        unitDropdown.disabled = false;
        quantityInput.disabled = false;
    });

    function updateMaterialList() {
        materialsList.innerHTML = "";
        materials.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.classList.add("material-item");
            listItem.innerHTML = `
                <span>${item.material} (${item.grade}) - ${item.quantity} ${item.unit}</span>
                <button class="delete-btn" onclick="removeMaterial(${index})">✖</button>
            `;
            materialsList.appendChild(listItem);
        });
    }

    addButton.addEventListener("click", () => {
        const material = materialDropdown.value;
        const grade = gradeDropdown.value;
        const unit = unitDropdown.value;
        const quantity = parseFloat(quantityInput.value);

        if (material && grade && quantity > 0) {
            materials.push({ material, grade, quantity, unit });
            updateMaterialList();
            quantityInput.value = "";
        } else {
            alert("Please select all fields and enter a valid quantity.");
        }
    });

    window.removeMaterial = (index) => {
        materials.splice(index, 1);
        updateMaterialList();
    };

    calculateButton.addEventListener("click", () => {
        if (materials.length === 0) {
            alert("Please add at least one material.");
            return;
        }

        let totalCarbon = 0;

        materials.forEach(item => {
            let convertedQuantity = item.quantity / unitConversions[item.material];
            totalCarbon += convertedQuantity * emissionFactors[item.material];
        });

        resultDiv.innerHTML = `<h3 class="result-text">Total Carbon Footprint: <span>${totalCarbon.toFixed(2)} kg CO₂</span></h3>`;
        downloadButton.style.display = "inline-block";
        window.totalCarbon = totalCarbon.toFixed(2); // Store for PDF
    });

    downloadButton.addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Carbon Footprint Calculator Results", 20, 20);

        const tableData = materials.map(item => {
            const footprint = (item.quantity * emissionFactors[item.material]).toFixed(2);
            return [
                item.material,
                item.grade,
                item.quantity,
                item.unit,
                `${footprint} kg CO₂`
            ];
        });

        const headers = ["Material", "Grade", "Quantity", "Unit", "Carbon Footprint"];

        doc.autoTable({
            head: [headers],
            body: tableData,
            startY: 30,
            margin: { top: 10 },
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [22, 160, 133] },
            theme: 'grid'
        });

        doc.setFontSize(14);
        doc.text(`Total Carbon Footprint: ${window.totalCarbon} kg CO₂`, 20, doc.lastAutoTable.finalY + 15);

        doc.save("carbon-footprint-result.pdf");
    });
});
