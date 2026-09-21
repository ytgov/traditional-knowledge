# Agreement document templates

`confidentiality-acknowledgement-template.docx` and `confidentiality-receipt-template.docx`
are rendered with [docxtemplater](https://docxtemplater.com/) from the data returned by
the matching serializer under
`api/src/serializers/information-sharing-agreements/`.

## Editing a template

Edit these files in Microsoft Word and save as `.docx`. Do not edit the XML inside the
archive by hand: placeholders are frequently split across several `<w:r>` runs, so a text
replacement that looks correct can produce a document Word refuses to open.

A rendering failure is now returned as an HTTP 400 rather than a truncated download, so a
broken template surfaces as an error message instead of a corrupt file (TK-39).

## Optional sections

The form at **Agreement → Additional Details (optional)** collects the optional
compelled disclosure notes (question 5), and the serializer supplies them as the
`disclosure_notes` placeholder. Place `{disclosure_notes}` in the blank line below
"Indicate if additional protocols are required" in
`confidentiality-acknowledgement-template.docx`.

### Known template issue

Both `.docx` files contain undeclared `[trash]/0000.dat`…`0003.dat` parts with no
`Default Extension="dat"` entry in `[Content_Types].xml`, plus a non-standard
`word/footer.xml`, which suggests they were last written by a tool other than Word. Word
may report "unreadable content" on the rendered output even when rendering succeeds.
Re-saving each template from Microsoft Word clears this.
