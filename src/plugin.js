document
    .getElementById("CreateButton")
    .addEventListener("click", async () => {
        const inputs = {
            width: Number(document.getElementById("Width").value),
            height: Number(document.getElementById("Height").value),
            length: Number(document.getElementById("Length").value)
        }

        const point1 = await WSM.Geom.Point3d(0,0,0)
        const point2 = await WSM.Geom.Point3d(inputs.width, inputs.length, inputs.height)
        const historyID = await FormIt.GroupEdit.GetEditingHistoryID()

        console.log(historyID, point1, point2)

        const cuboid = await WSM.APICreateBlock(historyID, point1, point2)

        console.log(cuboid)
    })
