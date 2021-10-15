document
    .getElementById("CreateButton")
    .addEventListener("click", async () => {
        const inputs = {
            width: Number(document.getElementById("Width").value),
            length: Number(document.getElementById("Length").value),
            height: Number(document.getElementById("Height").value),
            divisions: Number(document.getElementById("Divisions").value)
        }

        const constants = {
            radius: (inputs.width / inputs.divisions) * 0.75,
            accuracy: 5
        }

        const start = -0.5;
        const end = 0.5;
        const step = 1 / inputs.divisions;
        const xCoordinates = _.range(start, end, step).concat(end)
        const yCoordinates = _.range(start, end, step).concat(end)

        console.log(xCoordinates)
        console.log(yCoordinates)

        const historyID = await FormIt.GroupEdit.GetEditingHistoryID()
        for(const x of xCoordinates) {
            for(const y of yCoordinates) {
                const a = 1
                const b = -1
                const z = (a * Math.pow(x, 2)) + (b * Math.pow(y, 2))

                let point = await WSM.Geom.Point3d(x * inputs.width, y * inputs.length, z * inputs.height)
                WSM.APICreateHemisphere(historyID, constants.radius, point, constants.accuracy)
            }
        }
    })
