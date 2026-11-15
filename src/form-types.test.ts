// Compile-time checks for the LuCI form APIs used by consumers.
declare const section: LuCI.form.AbstractSection;
declare const modal: LuCI.form.NamedSection;
declare const grid: LuCI.form.GridSection;

const multi = section.option(LuCI.form.MultiValue, "services");
const nested = section.taboption(
	"tab",
	LuCI.form.SectionValue,
	"nested",
	LuCI.form.GridSection,
	"device",
);
nested.subsection.handleRemove("section");
section.description = "Section description";
section.map.data.get("config", "section", "option");
multi.value("internet", "Internet");
multi.renderWidget("section", 0, ["internet"]);
multi.transformChoices();
modal.children.forEach((option) => option.triggerValidation("section"));
grid.renderMoreOptionsModal("section");
grid.handleRemove("section");
section.getOption("services")?.getUIElement("section")?.setInvalid("Required");
// @ts-expect-error Option names must be strings.
section.getOption(42);
