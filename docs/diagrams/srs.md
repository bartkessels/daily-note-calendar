# Software requirements specification

## 1. Introduction

Purpose of this Document – At first, main aim of why this document is necessary and what’s purpose of document is
explained and described.

Scope of this document – In this, overall working and main objective of document and what value it will provide to
customer is described and explained. It also includes a description of development cost and time required.

Overview – In this, description of product is explained. It’s simply summary or overall review of product.

## 2. Overall description

In this, general functions of product which includes objective of user, a user characteristic, features, benefits, about
why its importance is mentioned. It also describes features of user community.

## 3. Functional requirements

In this, possible outcome of software system which includes effects due to operation of program is fully explained. All
functional requirements which may include calculations, data processing, etc. are placed in a ranked order. Functional
requirements specify the expected behavior of the system-which outputs should be produced from the given inputs. They
describe the relationship between the input and output of the system. For each functional requirement, detailed
description all the data inputs and their source, the units of measure, and the range of valid inputs must be specified.

## 4. Non-functional requirements

This chapter describes the non-functional requirements. The non-functional requirements that are specified in this
chapter adhere to the definitions as provided by the _ISO/IEC 25002_ specification, [(ISO, 2024)](https://www.iso.org/standard/78175.html). 
For a complete overview of the specified non-functional requirements, see [ISO 25000](https://iso25000.com/index.php/en/iso-25000-standards/iso-25010).

Each requirement has a reference number to allow cross-referencing.

|     __NFR01__ | _Compatability_                                                                                                                                                                                                                                   |
|--------------:|:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|     __Title__ | Must work with Obsidian.                                                                                                                                                                                                                          |
| __Rationale__ | Because this is a plugin for Obsidian, it must not interfere with the general working of Obsidian or other installed plugins. This includes that the used stylesheet for the plugin must not change any other part of the Obsidian configuration. |

|     __NFR02__ | _Compatability_                                                                                                                                                                                                                                                                                                                                                                                                   |
|--------------:|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|     __Title__ | Must work on all platforms that Obsidian supports.                                                                                                                                                                                                                                                                                                                                                                |
| __Rationale__ | Because Obsidian supports multiple platforms, the plugin must work on all of them. This includes but is not limited to mobile platforms. Because Obsidian on the desktop can use NodeJS and Electron API's, it's not supported on mobile platforms [(Obsidian, n.d.)](https://docs.obsidian.md/Plugins/Getting+started/Mobile+development#Node+and+Electron+APIs) and will therefore not work on those platforms. |
