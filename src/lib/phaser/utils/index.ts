export function getTiledProperty(obj: any, property_name: string): any {
    for (var property_index = 0; property_index < obj.properties.length; property_index += 1) {
        var property = obj.properties[property_index];
        if (property.name == property_name) {
            return property.value;
        }
    }
}
