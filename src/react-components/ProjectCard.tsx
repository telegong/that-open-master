import * as React from "react"

export function ProjectCard() {
    return (
        <div className="project-card">
        <div className="card-header">
            <p
                style={{
                    backgroundColor: "#ca8134",
                    padding: 5,
                    borderRadius: 8,
                    aspectRatio: 1,
                    textTransform: "uppercase",
                    textAlign: "center",
                    width: 36,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center"
                }}
            >
             HC
            </p>
            <div>
            <h5>Project Name</h5>
            {/*h5>${this.id}</h5*/}
            <p>Projcect Description</p>
            </div>
        </div>
        <div className="card-content">
            <div className="card-property">
            <p style={{ color: "#969696" }}>Status</p>
            <p>Active</p>
            </div>
            <div className="card-property">
            <p style={{ color: "#969696" }}>Role</p>
            <p>Developer</p>
            </div>
            <div className="card-property">
            <p style={{ color: "#969696" }}>Cost</p>
            <p>$1.000</p>
            </div>
            <div className="card-property">
            <p style={{ color: "#969696" }}>Estimated Progress</p>
            <p>67%</p>
            </div>
        </div>
        </div>

    )
}