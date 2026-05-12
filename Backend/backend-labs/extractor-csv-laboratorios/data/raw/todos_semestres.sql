-- ==============================================================================
-- 1. INSERCIÓN DE ASIGNATURAS (TODOS LOS SEMESTRES EXCEPTO 5)
-- ==============================================================================
INSERT INTO ASIGNATURA (CODIGO_ASIGNATURA, NOMBRE_ASIGNATURA, SEMESTRE_PLAN, CREDITOS) VALUES 
-- Semestre 1
('SIS101', 'FUNDAMENTOS DE PROGRAMACION', 1, 4),
('SIS102', 'MATEMATICAS I', 1, 3),
('SIS103', 'ALGEBRA LINEAL', 1, 3),
('SIS104', 'INGLES I', 1, 2),
-- Semestre 2
('SIS201', 'PROGRAMACION ORIENTADA A OBJETOS', 2, 4),
('SIS202', 'MATEMATICAS II', 2, 3),
('SIS203', 'FISICA I', 2, 3),
('SIS204', 'INGLES II', 2, 2),
-- Semestre 3
('SIS301', 'ESTRUCTURA DE DATOS I', 3, 3),
('SIS302', 'TEORIA DE GRAFOS', 3, 3),
('SIS303', 'FISICA II', 3, 3),
('SIS304', 'PROBABILIDAD Y ESTADISTICA', 3, 3),
-- Semestre 4
('SIS401', 'BASE DE DATOS I', 4, 3),
('SIS402', 'ARQUITECTURA DE COMPUTADORES', 4, 3),
('SIS403', 'METODOLOGIA DE LA INVESTIGACION', 4, 3),
('SIS404', 'INGLES III', 4, 2),
-- Semestre 6
('SIS601', 'PROYECTO DE GRADO I', 6, 4),
('SIS602', 'INGENIERIA DE SOFTWARE II', 6, 3),
('SIS603', 'REDES DE COMPUTADORES I', 6, 3),
('SIS604', 'SISTEMAS OPERATIVOS', 6, 3),
-- Semestre 7
('SIS701', 'SEMINARIO DE INVESTIGACION', 7, 3),
('SIS702', 'INGENIERIA WEB', 7, 3),
('SIS703', 'REDES DE COMPUTADORES II', 7, 3),
('SIS704', 'GESTION DE PROYECTOS', 7, 3),
-- Semestre 8
('SIS801', 'PROYECTO DE GRADO II', 8, 4),
('SIS802', 'SEGURIDAD INFORMATICA', 8, 3),
('SIS803', 'INTELIGENCIA ARTIFICIAL', 8, 3),
('SIS804', 'ELECTIVA I', 8, 3),
-- Semestre 9
('SIS901', 'PRACTICA PROFESIONAL', 9, 8),
('SIS902', 'ELECTIVA II', 9, 3),
('SIS903', 'AUDITORIA INFORMATICA', 9, 3),
('SIS904', 'GERENCIA DE SISTEMAS', 9, 3),
-- Semestre 10
('SIS1001', 'TRABAJO DE GRADO', 10, 10),
('SIS1002', 'ELECTIVA III', 10, 3),
('SIS1003', 'ELECTIVA IV', 10, 3),
('SIS1004', 'SEMINARIO DE ACTUALIZACION', 10, 3)
ON CONFLICT (CODIGO_ASIGNATURA) DO NOTHING;

-- ==============================================================================
-- 2. APERTURA DE CURSOS (PERIODO 20252)
-- ==============================================================================
INSERT INTO CURSO (CODIGO_ASIGNATURA, PERIODO, DOCENTE_ASIGNADO) VALUES
-- Semestre 1
('SIS101', '20252', 'DOCENTE FUNDAMENTOS'),
('SIS102', '20252', 'DOCENTE MATEMATICAS I'),
('SIS103', '20252', 'DOCENTE ALGEBRA'),
('SIS104', '20252', 'DOCENTE INGLES I'),
-- Semestre 2
('SIS201', '20252', 'DOCENTE POO'),
('SIS202', '20252', 'DOCENTE MATEMATICAS II'),
('SIS203', '20252', 'DOCENTE FISICA I'),
('SIS204', '20252', 'DOCENTE INGLES II'),
-- Semestre 3
('SIS301', '20252', 'DOCENTE ESTRUCTURAS I'),
('SIS302', '20252', 'DOCENTE GRAFOS'),
('SIS303', '20252', 'DOCENTE FISICA II'),
('SIS304', '20252', 'DOCENTE PROBABILIDAD'),
-- Semestre 4
('SIS401', '20252', 'DOCENTE BASES DE DATOS I'),
('SIS402', '20252', 'DOCENTE ARQUITECTURA'),
('SIS403', '20252', 'DOCENTE INVESTIGACION'),
('SIS404', '20252', 'DOCENTE INGLES III'),
-- Semestre 6
('SIS601', '20252', 'DOCENTE PROYECTO I'),
('SIS602', '20252', 'DOCENTE SOFTWARE II'),
('SIS603', '20252', 'DOCENTE REDES I'),
('SIS604', '20252', 'DOCENTE SISTEMAS OPERATIVOS'),
-- Semestre 7
('SIS701', '20252', 'DOCENTE SEMINARIO'),
('SIS702', '20252', 'DOCENTE WEB'),
('SIS703', '20252', 'DOCENTE REDES II'),
('SIS704', '20252', 'DOCENTE GESTION'),
-- Semestre 8
('SIS801', '20252', 'DOCENTE PROYECTO II'),
('SIS802', '20252', 'DOCENTE SEGURIDAD'),
('SIS803', '20252', 'DOCENTE IA'),
('SIS804', '20252', 'DOCENTE ELECTIVA I'),
-- Semestre 9
('SIS901', '20252', 'DOCENTE PRACTICA'),
('SIS902', '20252', 'DOCENTE ELECTIVA II'),
('SIS903', '20252', 'DOCENTE AUDITORIA'),
('SIS904', '20252', 'DOCENTE GERENCIA'),
-- Semestre 10
('SIS1001', '20252', 'DOCENTE TRABAJO GRADO'),
('SIS1002', '20252', 'DOCENTE ELECTIVA III'),
('SIS1003', '20252', 'DOCENTE ELECTIVA IV'),
('SIS1004', '20252', 'DOCENTE ACTUALIZACION');

-- ==============================================================================
-- 3. MOTOR GENERADOR PARA ESTUDIANTES DE TODOS LOS SEMESTRES
-- (Excluye 5to porque ya existe en la DB)
-- ==============================================================================
DO $$
DECLARE
    i INT;
    j INT;
    k INT;
    v_doc VARCHAR;
    v_nom VARCHAR;
    v_ape VARCHAR;
    v_semestre INT;
    v_curso_id INT;
    v_mat_id INT;
    v_nota1 NUMERIC;
    v_nota2 NUMERIC;
    v_nota3 NUMERIC;
    v_fecha DATE;
    v_asistio BOOLEAN;
    
    v_nombres TEXT[] := ARRAY['JUAN PABLO', 'MARIA FERNANDA', 'CARLOS ANDRES', 'LAURA SOFIA', 'ANDRES FELIPE', 'DIANA PATRICIA', 'DIEGO', 'VALENTINA', 'CAMILO', 'NATALIA', 'JORGE', 'SARA', 'DAVID', 'DANIELA', 'MATEO'];
    v_apellidos TEXT[] := ARRAY['GOMEZ', 'LOPEZ', 'MARTINEZ', 'RODRIGUEZ', 'PEREZ', 'SANCHEZ', 'RAMIREZ', 'CRUZ', 'DIAZ', 'HERNANDEZ', 'MUÑOZ', 'ROSERO', 'ORTEGA', 'VILLOTA', 'NARVAEZ'];
    
    v_semestres INT[] := ARRAY[1, 2, 3, 4, 6, 7, 8, 9];
BEGIN
    v_doc := '1085500015'::VARCHAR;
    
    FOREACH v_semestre IN ARRAY v_semestres LOOP
        FOR i IN 1..15 LOOP
            v_doc := (1085500000 + (v_semestre - 1) * 15 + i + 15)::VARCHAR;
            v_nom := v_nombres[i];
            v_ape := v_apellidos[floor(random() * array_length(v_apellidos, 1) + 1)] || ' ' || v_apellidos[floor(random() * array_length(v_apellidos, 1) + 1)];
            
            INSERT INTO ESTUDIANTE (NUMERO_DOCUMENTO, TIPO_DOCUMENTO, NOMBRES, APELLIDOS, DIRECCION, CORREO_INSTITUCIONAL, CORREO_PERSONAL, TELEFONO, SEMESTRE_ACTUAL)
            VALUES (
                v_doc, 
                'CC', 
                v_nom, 
                v_ape, 
                'CALLE ' || floor(random()*50+1) || ' # ' || floor(random()*30+1) || '-' || floor(random()*99+1) || ', PASTO',
                LOWER(REPLACE(split_part(v_nom, ' ', 1), ' ', '')) || substring(v_doc, 7, 4) || '@umariana.edu.co', 
                LOWER(REPLACE(split_part(v_nom, ' ', 1), ' ', '')) || i || '@gmail.com', 
                '3' || floor(random()*(320-300+1)+300)::text || floor(random()*8999999)::text, 
                v_semestre
            );
            
            FOR v_curso_id IN (SELECT c.ID_CURSO FROM CURSO c JOIN ASIGNATURA a ON c.CODIGO_ASIGNATURA = a.CODIGO_ASIGNATURA WHERE a.SEMESTRE_PLAN = v_semestre) LOOP
                INSERT INTO MATRICULA (NUMERO_DOCUMENTO, ID_CURSO) VALUES (v_doc, v_curso_id) RETURNING ID_MATRICULA INTO v_mat_id;
                
                IF random() > 0.80 THEN
                    v_nota1 := round((random() * 2.0 + 1.0)::numeric, 1);
                    v_nota2 := round((random() * 2.5 + 1.0)::numeric, 1);
                    v_nota3 := round((random() * 2.0 + 1.0)::numeric, 1);
                ELSE
                    v_nota1 := round((random() * 2.0 + 3.0)::numeric, 1);
                    v_nota2 := round((random() * 1.5 + 3.5)::numeric, 1);
                    v_nota3 := round((random() * 2.0 + 3.0)::numeric, 1);
                END IF;
                
                INSERT INTO CALIFICACION (ID_MATRICULA, SEGUIMIENTO_1, SEGUIMIENTO_2, SEGUIMIENTO_3) 
                VALUES (v_mat_id, v_nota1, v_nota2, v_nota3);
                
                FOR j IN 1..16 LOOP
                    v_fecha := '2025-08-01'::DATE + (j * 7); 
                    
                    IF v_nota1 < 3.0 AND random() > 0.5 THEN
                        v_asistio := FALSE;
                    ELSIF random() > 0.90 THEN
                        v_asistio := FALSE;
                    ELSE
                        v_asistio := TRUE;
                    END IF;
                    
                    INSERT INTO ASISTENCIA (ID_MATRICULA, FECHA_CLASE, ESTADO_ASISTENCIA) 
                    VALUES (v_mat_id, v_fecha, v_asistio);
                END LOOP;
            END LOOP;
        END LOOP;
    END LOOP;
END $$;