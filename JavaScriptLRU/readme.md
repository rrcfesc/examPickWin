# Detalle de Ejercicio 
Ejercicio 2 ( Javascript)
Tiempo: 4hrs
Programar una librería que implemente la estructura de datos para el cache LRU ( least recently 
used ) o Menos Usada Recientemente. Debe de implementar las operaciones “get” y “put”.

Las operaciones get y put, deberán de realizarse en un tiempo O(1).
get(key) – Obtener el valor (siempre positivo) de la llave si es que existe en el cache, si no existe 
deberá regresar -1.

put(key, value) – Deberá actualizar el valor de la llave o insertar el valor si no está presente.
Cuando el cache ha llegado a su límite o capacidad máxima, deberá eliminar el ítem menos 
usada recientemente antes de insertar un nuevo ítem.

## Respuesta.
Los Test están en el archivo test.js, lo que pueden ejecutar de la siguiente manera:
```
$ node test.js
```