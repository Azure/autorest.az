

import { CommandExample } from "./CodeModelAz";

function MethodToOrder(method: string): number {
    if (method == 'create') return 0;
    else if (method in ['show', 'list']) return 1;
    else if (method == 'delete') return 3;
    else return 2;
}

export function GenerateDefaultTestScenario(
    examples: CommandExample[]): any[] {
    console.warn("");
    console.warn("NO TEST SCENARIO PROVIDED - DEFAULT WILL BE USED");
    console.warn("ADD FOLLOWING SECTION TO readme.cli.md FILE TO MODIFY IT");
    console.warn("--------------------------------------------------------");
    console.warn("  test-scenario:");

    let testScenario = [];

    let sorted: CommandExample[] = examples.sort((e1, e2) => {
        let n1 = MethodToOrder(e1.Method);
        let n2 = MethodToOrder(e2.Method);
        if (n1 == n2) {
            if (e1.Method == "create") return (e1.Path.length > e2.Path.length) ? 1 : -1;
            else return (e1.Path.length > e2.Path.length) ? -1 : 1;
        }
        return (n1 > n2) ? 1 : -1;
    })

    for (var i = 0; i < sorted.length; i++) {
        var example: CommandExample = examples[i];
        console.warn("    - name: " + example.Id);
        testScenario.push({ name: example.Id })
    }
    console.warn("--------------------------------------------------------");
    return testScenario;
}
