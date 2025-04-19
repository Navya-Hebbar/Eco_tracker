document.addEventListener("DOMContentLoaded", () => {
    // Select elements
    const materialDropdown = document.getElementById("material");
    const gradeDropdown = document.getElementById("grade");
    const unitDropdown = document.getElementById("unit");
    const quantityInput = document.getElementById("quantity");
    const addButton = document.getElementById("add-material");
    const materialsList = document.getElementById("material-items");
    const calculateButton = document.getElementById("calculate");
    const resultDiv = document.getElementById("result");

    let materials = [];

    // Grade options based on material selection
    const gradeOptions = {
        "Cement": ["OPC 33", "OPC 43", "OPC 53", "PPC", "PSC"],
        "Steel": ["Fe 415", "Fe 500", "Fe 550", "Fe 600"],
        "Sand": ["River Sand", "M-Sand"],
        "Bricks": ["Clay Bricks", "Fly Ash Bricks", "AAC Blocks"],
        "Concrete": ["M15", "M20", "M25", "M30"]
    };

    // Unit options based on material selection
    const unitOptions = {
        "Cement": "kg",
        "Steel": "kg",
        "Sand": "m³",
        "Bricks": "Numbers",
        "Concrete": "m³"
    };

    // Ensure the dropdown is populated on load
    console.log("Material dropdown options:", materialDropdown.innerHTML);

    // Update dropdowns dynamically when material is selected
    materialDropdown.addEventListener("change", () => {
        const selectedMaterial = materialDropdown.value;
        console.log("Material selected:", selectedMaterial);

        // Update grade dropdown
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

        // Set unit dropdown
        unitDropdown.innerHTML = `<option value="${unitOptions[selectedMaterial]}" selected>${unitOptions[selectedMaterial]}</option>`;
        unitDropdown.disabled = false;
        quantityInput.disabled = false;
    });

    // Function to update material list UI
    function updateMaterialList() {
        materialsList.innerHTML = ""; // Clear the list before updating

        materials.forEach((item, index) => {
            const listItem = document.createElement("li");
            listItem.classList.add("material-item"); // Styled list items
            listItem.innerHTML = `
                <span>${item.material} (${item.grade}) - ${item.quantity} ${item.unit}</span>
                <button class="delete-btn" onclick="removeMaterial(${index})">✖</button>
            `;
            materialsList.appendChild(listItem);
        });
    }

    // Function to add material
    addButton.addEventListener("click", () => {
        const material = materialDropdown.value;
        const grade = gradeDropdown.value;
        const unit = unitDropdown.value;
        const quantity = parseFloat(quantityInput.value);

        if (material && grade && quantity > 0) {
            materials.push({ material, grade, quantity, unit });
            updateMaterialList(); // Refresh UI
            quantityInput.value = ""; // Clear input after adding
        } else {
            alert("Please select all fields and enter a valid quantity.");
        }
    });

    // Function to remove material
    window.removeMaterial = (index) => {
        materials.splice(index, 1);
        updateMaterialList();
    };

    // Function to calculate carbon footprint (Ensuring output is in kg CO₂)
    calculateButton.addEventListener("click", () => {
        if (materials.length === 0) {
            alert("Please add at least one material.");
            return;
        }

        let totalCarbon = 0;

        const emissionFactors = {
            "Cement": 0.9,    // kg CO₂ per kg
            "Steel": 1.8,     // kg CO₂ per kg
            "Sand": 14.0,     // kg CO₂ per m³
            "Bricks": 0.2,    // kg CO₂ per brick
            "Concrete": 290.0 // kg CO₂ per m³
        };

        const unitConversions = {
            "Cement": 1,      // kg remains kg
            "Steel": 1,       // kg remains kg
            "Sand": 1,        // m³ remains m³
            "Bricks": 1,      // Keeping bricks as 1-to-1 conversion
            "Concrete": 1     // m³ remains m³
        };

        materials.forEach(item => {
            let convertedQuantity = item.quantity / unitConversions[item.material]; // Convert to base unit
            totalCarbon += convertedQuantity * emissionFactors[item.material];
        });

        // Styled output
        resultDiv.innerHTML = `<h3 class="result-text">Total Carbon Footprint: <span>${totalCarbon.toFixed(2)} kg CO₂</span></h3>`;
    });
});
