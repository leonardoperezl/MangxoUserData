import pandas as pd
import matplotlib.pyplot as plt
import sys
import os

def procesar_csv_y_generar_grafica(archivo_csv, carpeta_salida):
    df = pd.read_csv(archivo_csv)
    df['FECHA'] = pd.to_datetime(df['FECHA'])
    df.sort_values(by='FECHA', inplace=True)

    saldo = 0
    saldos = []
    for index, row in df.iterrows():
        if row['TIPO'].upper() == "DEPOSITO":
            saldo += row['MONTO']
        elif row['TIPO'].upper() == "RETIRO":
            saldo -= row['MONTO']
        saldos.append(saldo)

    df['SALDO'] = saldos

    # Graficar
    plt.figure(figsize=(12, 6))
    plt.plot(df['FECHA'], df['SALDO'], marker='o', linestyle='-', label='Saldo acumulado')
    plt.axhline(0, color='red', linestyle='--', label='Saldo inicial (0)')
    plt.title('Flujo de dinero')
    plt.xlabel('Fecha')
    plt.ylabel('Saldo')
    plt.legend()
    plt.grid(True)
    plt.tight_layout()

    os.makedirs(carpeta_salida, exist_ok=True)

    # Guardar la gráfica como imagen
    nombre_grafica = 'flujo_dinero.png'
    ruta_grafica = os.path.join(carpeta_salida, nombre_grafica)
    plt.savefig(ruta_grafica, dpi=300)

    return ruta_grafica

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uso: python script.py <ruta_del_archivo_csv>")
        sys.exit(1)

    archivo_csv = sys.argv[1]  # Ruta del archivo CSV como argumento
    carpeta_salida = os.path.join(os.path.dirname(archivo_csv), '../GraphSamples')  # Carpeta para guardar la gráfica

    ruta_grafica = procesar_csv_y_generar_grafica(archivo_csv, carpeta_salida)
    print(ruta_grafica)  # Imprimir la ruta de la gráfica generada
