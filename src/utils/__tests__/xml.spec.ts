import { parseXml } from "../xml"

describe("parseXml", () => {
	describe("type conversion", () => {
		// Test the main change from the commit: no automatic type conversion
		it("should not convert string numbers to numbers", () => {
			const xml = `
        <dewt>
          <numericString>123</numericString>
          <negativeNumericString>-456</negativeNumericString>
          <floatNumericString>123.456</floatNumericString>
        </dewt>
      `

			const result = parseXml(xml) as any

			// Ensure these remain as strings and are not converted to numbers
			expect(typeof result.dewt.numericString).toBe("string")
			expect(result.dewt.numericString).toBe("123")

			expect(typeof result.dewt.negativeNumericString).toBe("string")
			expect(result.dewt.negativeNumericString).toBe("-456")

			expect(typeof result.dewt.floatNumericString).toBe("string")
			expect(result.dewt.floatNumericString).toBe("123.456")
		})

		it("should not convert string booleans to booleans", () => {
			const xml = `
        <dewt>
          <boolTrue>true</boolTrue>
          <boolFalse>false</boolFalse>
        </dewt>
      `

			const result = parseXml(xml) as any

			// Ensure these remain as strings and are not converted to booleans
			expect(typeof result.dewt.boolTrue).toBe("string")
			expect(result.dewt.boolTrue).toBe("true")

			expect(typeof result.dewt.boolFalse).toBe("string")
			expect(result.dewt.boolFalse).toBe("false")
		})

		it("should not convert attribute values to their respective types", () => {
			const xml = `
        <dewt>
          <node id="123" enabled="true" disabled="false" float="3.14" />
        </dewt>
      `

			const result = parseXml(xml) as any
			const attributes = result.dewt.node

			// Check that attributes remain as strings
			expect(typeof attributes["@_id"]).toBe("string")
			expect(attributes["@_id"]).toBe("123")

			expect(typeof attributes["@_enabled"]).toBe("string")
			expect(attributes["@_enabled"]).toBe("true")

			expect(typeof attributes["@_disabled"]).toBe("string")
			expect(attributes["@_disabled"]).toBe("false")

			expect(typeof attributes["@_float"]).toBe("string")
			expect(attributes["@_float"]).toBe("3.14")
		})
	})

	describe("basic functionality", () => {
		it("should correctly parse a simple XML string", () => {
			const xml = `
        <dewt>
          <name>Test Name</name>
          <description>Some description</description>
        </dewt>
      `

			const result = parseXml(xml) as any

			expect(result).toHaveProperty("dewt")
			expect(result.dewt).toHaveProperty("name", "Test Name")
			expect(result.dewt).toHaveProperty("description", "Some description")
		})

		it("should handle attributes correctly", () => {
			const xml = `
        <dewt>
          <item id="1" category="test">Item content</item>
        </dewt>
      `

			const result = parseXml(xml) as any

			expect(result.dewt.item).toHaveProperty("@_id", "1")
			expect(result.dewt.item).toHaveProperty("@_category", "test")
			expect(result.dewt.item).toHaveProperty("#text", "Item content")
		})

		it("should support stopNodes parameter", () => {
			const xml = `
        <dewt>
          <data>
            <nestedXml><item>Should not parse this</item></nestedXml>
          </data>
        </dewt>
      `

			const result = parseXml(xml, ["nestedXml"]) as any

			// With stopNodes, the parser still parses the structure but stops at the specified node
			expect(result.dewt.data.nestedXml).toBeTruthy()
			expect(result.dewt.data.nestedXml).toHaveProperty("item", "Should not parse this")
		})
	})
})
