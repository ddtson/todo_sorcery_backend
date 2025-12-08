import { StatusCodes } from "http-status-codes";
import { app } from "@/server";

describe("Health Check API endpoints", () => {
	it("GET / - success", async () => {
		const response = await app.inject({
			url: "/health-check",
			method: "GET",
		});
		const result = response.json();

		expect(response.statusCode).toEqual(StatusCodes.OK);
		expect(result.success).toBeTruthy();
		expect(result.responseObject).toBeNull();
		expect(result.message).toEqual("Service is healthy");
	});
});
